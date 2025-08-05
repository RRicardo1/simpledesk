import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Initialize Stripe with fallback
const STRIPE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rote9QKQnR8VR9RyKR30jpkeGwejAbZyoWi6vZ5P1VVhfxggFLAnc4GXPA3prBAfylMZxGMaCZUhaWOEA5zzjHc00UbupmGtJ';
console.log('Stripe Key:', STRIPE_KEY);
const stripePromise = loadStripe(STRIPE_KEY);

const BillingPage = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const plans = {
    starter: {
      name: 'Starter',
      price: 29,
      features: ['Up to 3 agents', '1,000 tickets/month', 'Email support', 'Basic reporting']
    },
    growth: {
      name: 'Growth', 
      price: 59,
      features: ['Up to 10 agents', '5,000 tickets/month', 'Chat support', 'Advanced reporting', 'API access']
    },
    business: {
      name: 'Business',
      price: 99,
      features: ['Unlimited agents', 'Unlimited tickets', 'Priority support', 'Custom integrations', 'White-label']
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await axios.get('/billing/subscription');
      setSubscription(response.data);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose your plan and start accepting customer tickets today
          </p>
        </div>

        {subscription?.subscription ? (
          <CurrentSubscription subscription={subscription} onCancel={fetchSubscription} />
        ) : (
          <Elements stripe={stripePromise}>
            <SubscriptionPlans 
              plans={plans}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              showPaymentForm={showPaymentForm}
              setShowPaymentForm={setShowPaymentForm}
              onSuccess={fetchSubscription}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};

const CurrentSubscription = ({ subscription, onCancel }) => {
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return;
    
    setCancelling(true);
    try {
      await axios.post('/billing/cancel');
      alert('Subscription will be cancelled at the end of the current period');
      onCancel();
    } catch (error) {
      alert('Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Subscription</h2>
        
        <div className="space-y-4">
          <div>
            <span className="font-medium">Plan:</span>
            <span className="ml-2 capitalize">{subscription.plan}</span>
          </div>
          
          {subscription.subscription && (
            <>
              <div>
                <span className="font-medium">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  subscription.subscription.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {subscription.subscription.status}
                </span>
              </div>
              
              <div>
                <span className="font-medium">Next billing date:</span>
                <span className="ml-2">
                  {new Date(subscription.subscription.currentPeriodEnd * 1000).toLocaleDateString()}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
};

const SubscriptionPlans = ({ plans, selectedPlan, setSelectedPlan, showPaymentForm, setShowPaymentForm, onSuccess }) => {
  
  const handlePlanSelect = (planKey) => {
    console.log('Plan selected:', planKey);
    setSelectedPlan(planKey);
    setShowPaymentForm(true);
    console.log('Payment form should show:', true);
  };

  return (
    <div className="mt-12">
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {Object.entries(plans).map(([planKey, plan]) => (
          <div
            key={planKey}
            className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer border-2 transition-all ${
              selectedPlan === planKey ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handlePlanSelect(planKey)}
          >
            <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
            <div className="mt-4">
              <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
              <span className="text-gray-600">/month</span>
            </div>
            
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            {selectedPlan === planKey && (
              <div className="mt-4 text-center">
                <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Selected Plan
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {showPaymentForm && selectedPlan && (
        <div className="mt-8 max-w-md mx-auto">
          <PaymentForm 
            selectedPlan={selectedPlan} 
            planName={plans[selectedPlan].name} 
            onSuccess={onSuccess}
            onCancel={() => {
              setShowPaymentForm(false);
              setSelectedPlan(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

const PaymentForm = ({ selectedPlan, planName, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Debug Stripe loading
  React.useEffect(() => {
    console.log('Stripe Promise:', stripePromise);
    console.log('Stripe Instance:', stripe);
    console.log('Elements Instance:', elements);
    console.log('Stripe Publishable Key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    try {
      const cardElement = elements.getElement(CardElement);
      
      // Create payment method
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentError) {
        setError(paymentError.message);
        setProcessing(false);
        return;
      }

      // Create subscription
      const response = await axios.post('/billing/subscribe', {
        plan: selectedPlan,
        paymentMethodId: paymentMethod.id
      });

      if (response.data.clientSecret) {
        // Confirm payment if needed
        const { error: confirmError } = await stripe.confirmCardPayment(response.data.clientSecret);
        
        if (confirmError) {
          setError(confirmError.message);
        } else {
          alert('Subscription created successfully!');
          onSuccess();
        }
      } else {
        alert('Subscription created successfully!');
        onSuccess();
      }

    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create subscription');
    } finally {
      setProcessing(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading payment form...</p>
          {!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY && (
            <p className="mt-2 text-red-600 text-sm">⚠️ Stripe publishable key not configured</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Subscribe to {planName}</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="border rounded-md p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {processing ? 'Processing...' : `Subscribe to ${planName}`}
        </button>
      </div>
    </form>
  );
};

export default BillingPage;