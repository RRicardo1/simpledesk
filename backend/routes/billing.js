const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get current subscription
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const orgResult = await db.query(
      'SELECT plan, stripe_customer_id, stripe_subscription_id FROM organizations WHERE id = $1',
      [req.user.organization_id]
    );

    if (orgResult.rows.length === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const org = orgResult.rows[0];
    let subscription = null;

    if (org.stripe_subscription_id) {
      try {
        subscription = await stripe.subscriptions.retrieve(org.stripe_subscription_id);
      } catch (error) {
        console.error('Failed to retrieve Stripe subscription:', error);
      }
    }

    res.json({
      plan: org.plan,
      subscription: subscription ? {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      } : null
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

// Create customer and subscription
router.post('/subscribe', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { plan, paymentMethodId } = req.body;

  try {
    if (!plan || !paymentMethodId) {
      return res.status(400).json({ error: 'Plan and payment method are required' });
    }

    // Validate plan
    const planPrices = {
      starter: process.env.STRIPE_STARTER_PRICE,
      growth: process.env.STRIPE_GROWTH_PRICE,
      business: process.env.STRIPE_BUSINESS_PRICE
    };

    console.log('Plan:', plan);
    console.log('Plan Prices:', planPrices);
    console.log('Selected Price:', planPrices[plan]);

    if (!planPrices[plan]) {
      return res.status(400).json({ 
        error: 'Invalid plan',
        details: `Plan '${plan}' not found. Available plans: ${Object.keys(planPrices).join(', ')}`,
        planPrices: planPrices
      });
    }

    // Get organization
    const orgResult = await db.query(
      'SELECT id, name, stripe_customer_id FROM organizations WHERE id = $1',
      [req.user.organization_id]
    );

    const org = orgResult.rows[0];
    let customerId = org.stripe_customer_id;

    // Create customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: org.name,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      customerId = customer.id;

      // Update organization with customer ID
      await db.query(
        'UPDATE organizations SET stripe_customer_id = $1 WHERE id = $2',
        [customerId, req.user.organization_id]
      );
    } else {
      // Attach payment method to existing customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: planPrices[plan] }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    // Update organization with subscription info
    await db.query(
      'UPDATE organizations SET plan = $1, stripe_subscription_id = $2 WHERE id = $3',
      [plan, subscription.id, req.user.organization_id]
    );

    res.json({
      message: 'Subscription created successfully',
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });

  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Cancel subscription
router.post('/cancel', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const orgResult = await db.query(
      'SELECT stripe_subscription_id FROM organizations WHERE id = $1',
      [req.user.organization_id]
    );

    const org = orgResult.rows[0];
    
    if (!org.stripe_subscription_id) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    // Cancel subscription at period end
    await stripe.subscriptions.update(org.stripe_subscription_id, {
      cancel_at_period_end: true
    });

    res.json({ message: 'Subscription will be cancelled at the end of the current period' });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'subscription.created':
      case 'subscription.updated':
        const subscription = event.data.object;
        await handleSubscriptionUpdate(subscription);
        break;
      
      case 'subscription.deleted':
        const deletedSubscription = event.data.object;
        await handleSubscriptionCancelled(deletedSubscription);
        break;
      
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handlePaymentSucceeded(invoice);
        break;
      
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        await handlePaymentFailed(failedInvoice);
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Helper functions for webhook handlers
async function handleSubscriptionUpdate(subscription) {
  try {
    const planMapping = {
      [process.env.STRIPE_STARTER_PRICE]: 'starter',
      [process.env.STRIPE_GROWTH_PRICE]: 'growth', 
      [process.env.STRIPE_BUSINESS_PRICE]: 'business'
    };

    const priceId = subscription.items.data[0].price.id;
    const plan = planMapping[priceId] || 'starter';

    await db.query(
      `UPDATE organizations 
       SET plan = $1, stripe_subscription_id = $2, status = $3
       WHERE stripe_customer_id = $4`,
      [plan, subscription.id, subscription.status === 'active' ? 'active' : 'suspended', subscription.customer]
    );
  } catch (error) {
    console.error('Handle subscription update error:', error);
  }
}

async function handleSubscriptionCancelled(subscription) {
  try {
    await db.query(
      `UPDATE organizations 
       SET status = $1, stripe_subscription_id = NULL
       WHERE stripe_customer_id = $2`,
      ['cancelled', subscription.customer]
    );
  } catch (error) {
    console.error('Handle subscription cancelled error:', error);
  }
}

async function handlePaymentSucceeded(invoice) {
  try {
    // Log successful payment
    await db.query(
      `INSERT INTO activity_logs (organization_id, action, details)
       SELECT id, $1, $2
       FROM organizations 
       WHERE stripe_customer_id = $3`,
      ['payment_succeeded', JSON.stringify({ 
        invoiceId: invoice.id, 
        amount: invoice.amount_paid 
      }), invoice.customer]
    );
  } catch (error) {
    console.error('Handle payment succeeded error:', error);
  }
}

async function handlePaymentFailed(invoice) {
  try {
    // Log failed payment and suspend if needed
    await db.query(
      `INSERT INTO activity_logs (organization_id, action, details)
       SELECT id, $1, $2
       FROM organizations 
       WHERE stripe_customer_id = $3`,
      ['payment_failed', JSON.stringify({ 
        invoiceId: invoice.id, 
        amount: invoice.amount_due 
      }), invoice.customer]
    );

    // TODO: Send notification email to admin
    // TODO: Suspend organization after multiple failed payments
  } catch (error) {
    console.error('Handle payment failed error:', error);
  }
}

module.exports = router;