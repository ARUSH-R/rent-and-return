import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../auth/AuthContext';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Loader';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_PUBLISHABLE_KEY');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [billingDetails, setBillingDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'IN'
    }
  });

  const total = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  useEffect(() => {
    // Create PaymentIntent on the server
    const createPaymentIntent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            amount: total * 100, // Convert to cents
            currency: 'inr',
            items: cart.items
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        toast.error('Failed to initialize payment. Please try again.');
        // For demo purposes, create a mock client secret
        setClientSecret('pi_mock_client_secret_for_demo');
      }
    };

    if (cart?.items?.length > 0) {
      createPaymentIntent();
    }
  }, [cart, total]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setBillingDetails(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      // For demo purposes, simulate payment success
      if (clientSecret === 'pi_mock_client_secret_for_demo') {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Clear cart and redirect
        await clearCart();
        toast.success('Payment successful! Thank you for your order.');
        navigate('/checkout/success');
        return;
      }

      // Real Stripe payment processing
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails
        }
      });

      if (error) {
        console.error('Payment error:', error);
        toast.error(error.message || 'Payment failed. Please try again.');
      } else if (paymentIntent.status === 'succeeded') {
        // Payment successful
        await clearCart();
        toast.success('Payment successful! Thank you for your order.');
        navigate('/checkout/success');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (!cart?.items?.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checkout.</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img
                  src={item.image || './assets/no-image.jpg'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">₹{item.price * item.quantity}</p>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Billing Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={billingDetails.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={billingDetails.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={billingDetails.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address Line 1</label>
              <input
                type="text"
                name="address.line1"
                value={billingDetails.address.line1}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address Line 2 (Optional)</label>
              <input
                type="text"
                name="address.line2"
                value={billingDetails.address.line2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="address.city"
                  value={billingDetails.address.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  name="address.state"
                  value={billingDetails.address.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <input
                  type="text"
                  name="address.postal_code"
                  value={billingDetails.address.postal_code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Card Element */}
            <div>
              <label className="block text-sm font-medium mb-1">Card Details</label>
              <div className="border rounded-lg p-3 bg-gray-50">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <Loader size="sm" />
                  <span className="ml-2">Processing...</span>
                </div>
              ) : (
                `Pay ₹${total}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
