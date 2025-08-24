import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ExclamationTriangleIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;
    
    setLoading(true);
    
    try {
      const cardElement = elements.getElement(CardElement);
      
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        onError(error.message);
        setLoading(false);
        return;
      }

      // Convert trial to paid subscription
      const response = await axios.post('/trial/convert', {
        paymentMethodId: paymentMethod.id
      });

      onSuccess(response.data);
    } catch (error) {
      onError(error.response?.data?.error || 'Payment failed');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-lg">
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
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-primary w-full flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCardIcon className="h-5 w-5 mr-2" />
            Start Paid Subscription ($29/month)
          </>
        )}
      </button>
    </form>
  );
};

const TrialBanner = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const queryClient = useQueryClient();

  // Fetch trial status
  const { data: trialData, isLoading } = useQuery(
    'trial-status',
    () => axios.get('/trial/status').then(res => res.data),
    {
      refetchInterval: 60000, // Refetch every minute
    }
  );

  // Convert trial mutation
  const convertTrialMutation = useMutation(
    (paymentData) => axios.post('/trial/convert', paymentData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trial-status');
        setShowPaymentForm(false);
        setPaymentError('');
        alert('Successfully upgraded to paid plan!');
      },
      onError: (error) => {
        setPaymentError(error.response?.data?.error || 'Conversion failed');
      }
    }
  );

  if (isLoading || !trialData || !trialData.isTrial) {
    return null;
  }

  const { daysRemaining, isExpired } = trialData;

  const getBannerColor = () => {
    if (isExpired) return 'bg-red-50 border-red-200';
    if (daysRemaining <= 3) return 'bg-orange-50 border-orange-200';
    if (daysRemaining <= 7) return 'bg-yellow-50 border-yellow-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getTextColor = () => {
    if (isExpired) return 'text-red-800';
    if (daysRemaining <= 3) return 'text-orange-800';
    if (daysRemaining <= 7) return 'text-yellow-800';
    return 'text-blue-800';
  };

  const getIconColor = () => {
    if (isExpired) return 'text-red-500';
    if (daysRemaining <= 3) return 'text-orange-500';
    if (daysRemaining <= 7) return 'text-yellow-500';
    return 'text-blue-500';
  };

  const getMessage = () => {
    if (isExpired) {
      return 'Your free trial has expired. Please upgrade to continue using MySimpleDesk.';
    }
    if (daysRemaining === 0) {
      return 'Your free trial expires today. Upgrade now to continue service.';
    }
    if (daysRemaining === 1) {
      return 'Your free trial expires tomorrow. Upgrade to avoid service interruption.';
    }
    return `Your free trial expires in ${daysRemaining} days. Upgrade anytime to continue after trial.`;
  };

  const handlePaymentSuccess = (data) => {
    queryClient.invalidateQueries('trial-status');
    setShowPaymentForm(false);
    setPaymentError('');
    alert('Successfully upgraded to paid plan! Welcome to MySimpleDesk Pro.');
  };

  const handlePaymentError = (error) => {
    setPaymentError(error);
  };

  return (
    <div className={`border rounded-lg p-4 mb-6 ${getBannerColor()}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className={`h-5 w-5 ${getIconColor()}`} />
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${getTextColor()}`}>
            {getMessage()}
          </p>
          
          {showPaymentForm && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Enter your payment information to upgrade:
              </h4>
              
              {paymentError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {paymentError}
                </div>
              )}
              
              <Elements stripe={stripePromise}>
                <PaymentForm 
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </div>
          )}
        </div>
        
        <div className="ml-4 flex space-x-2">
          {!showPaymentForm && (
            <button
              onClick={() => setShowPaymentForm(true)}
              className="btn-primary text-sm px-4 py-2"
            >
              Upgrade Now
            </button>
          )}
          
          {showPaymentForm && (
            <button
              onClick={() => {
                setShowPaymentForm(false);
                setPaymentError('');
              }}
              className="text-sm text-gray-600 hover:text-gray-800 px-3 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;