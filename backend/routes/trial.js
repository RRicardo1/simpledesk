const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Get trial status for current organization
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT is_trial, trial_start_date, trial_end_date, trial_status 
       FROM organizations 
       WHERE id = $1`,
      [req.user.organization_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const org = result.rows[0];
    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((new Date(org.trial_end_date) - now) / (1000 * 60 * 60 * 24)));

    res.json({
      isTrial: org.is_trial,
      trialStartDate: org.trial_start_date,
      trialEndDate: org.trial_end_date,
      trialStatus: org.trial_status,
      daysRemaining,
      isExpired: org.trial_status === 'expired' || (org.is_trial && now > new Date(org.trial_end_date))
    });

  } catch (error) {
    console.error('Trial status error:', error);
    res.status(500).json({ error: 'Failed to get trial status' });
  }
});

// Convert trial to paid subscription
router.post('/convert', authenticateToken, async (req, res) => {
  const { paymentMethodId } = req.body;

  try {
    if (!paymentMethodId) {
      return res.status(400).json({ error: 'Payment method is required' });
    }

    // Get organization details
    const orgResult = await db.query(
      'SELECT * FROM organizations WHERE id = $1',
      [req.user.organization_id]
    );

    if (orgResult.rows.length === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const organization = orgResult.rows[0];

    // Get user details for Stripe customer
    const userResult = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = userResult.rows[0];

    // Create Stripe customer if not exists
    let customerId = organization.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        metadata: {
          organizationId: organization.id,
          organizationName: organization.name
        }
      });
      customerId = customer.id;

      // Update organization with customer ID
      await db.query(
        'UPDATE organizations SET stripe_customer_id = $1 WHERE id = $2',
        [customerId, organization.id]
      );
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: process.env.STRIPE_PRICE_ID || 'price_1234567890', // You'll need to set this
      }],
      default_payment_method: paymentMethodId,
      expand: ['latest_invoice.payment_intent'],
    });

    // Update organization to convert from trial
    await db.query(
      `UPDATE organizations 
       SET is_trial = false, 
           trial_status = 'converted', 
           stripe_subscription_id = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [subscription.id, organization.id]
    );

    res.json({
      message: 'Trial converted to paid subscription successfully',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_end: subscription.current_period_end
      }
    });

  } catch (error) {
    console.error('Trial conversion error:', error);
    res.status(500).json({ 
      error: 'Failed to convert trial to paid subscription',
      details: error.message 
    });
  }
});

// Check and update expired trials (for scheduled job)
router.post('/check-expired', async (req, res) => {
  try {
    const now = new Date();
    
    // Find expired trials
    const expiredTrials = await db.query(
      `UPDATE organizations 
       SET trial_status = 'expired', updated_at = NOW()
       WHERE is_trial = true 
         AND trial_status = 'active' 
         AND trial_end_date < $1
       RETURNING id, name, trial_end_date`,
      [now]
    );

    console.log(`Updated ${expiredTrials.rows.length} expired trials`);

    res.json({
      message: 'Trial expiration check completed',
      expiredCount: expiredTrials.rows.length,
      expiredTrials: expiredTrials.rows
    });

  } catch (error) {
    console.error('Trial expiration check error:', error);
    res.status(500).json({ error: 'Failed to check expired trials' });
  }
});

// Extend trial (admin function)
router.post('/extend', authenticateToken, async (req, res) => {
  const { days = 30 } = req.body;

  try {
    // Only allow admin users to extend trials
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can extend trials' });
    }

    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + days);

    await db.query(
      `UPDATE organizations 
       SET trial_end_date = $1, 
           trial_status = 'active',
           updated_at = NOW()
       WHERE id = $2`,
      [newEndDate, req.user.organization_id]
    );

    res.json({
      message: `Trial extended by ${days} days`,
      newEndDate
    });

  } catch (error) {
    console.error('Trial extension error:', error);
    res.status(500).json({ error: 'Failed to extend trial' });
  }
});

module.exports = router;