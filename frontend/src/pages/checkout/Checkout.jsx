import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../../context/CartContextUtils';
import { useAuth } from '../../auth/AuthContextUtils';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Loader';
import api from '../../api/api';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_PUBLISHABLE_KEY');

const paymentMethods = [
  { label: 'Card', value: 'Card' },
  { label: 'UPI', value: 'UPI' },
  { label: 'Netbanking', value: 'Netbanking' },
  { label: 'Wallet', value: 'Wallet' },
  { label: 'Cash on Delivery (COD)', value: 'COD' },
];

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
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [upiId, setUpiId] = useState('');
  const [walletProvider, setWalletProvider] = useState('');
  const [netbankingBank, setNetbankingBank] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);

  const total = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  useEffect(() => {
    // Fetch addresses for selection
    const fetchAddresses = async () => {
      setAddressLoading(true);
      try {
        const res = await api.get('/v1/addresses');
        setAddresses(res.data);
        // Auto-select default address if present
        const defaultAddr = res.data.find(a => a.isDefault);
        setSelectedAddressId(defaultAddr ? defaultAddr.id : res.data[0]?.id);
      } catch (e) {
        setAddresses([]);
      } finally {
        setAddressLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    // Create Rental, then PaymentIntent
    const createRentalAndPaymentIntent = async () => {
      try {
        // 1. Create rental with selected address
        const rentalRes = await api.post('/rentals', {
          productId: cart.items[0]?.id, // TODO: Support multiple products/rentals if needed
          durationInDays: 1, // TODO: Make this dynamic
          addressId: selectedAddressId
        });
        const rentalId = rentalRes.data.id;
        // 2. Create Stripe PaymentIntent
        const paymentRes = await api.post(`/v1/payments/stripe/create-intent?rentalId=${rentalId}`, {
          email: billingDetails.email
        });
        setClientSecret(paymentRes.data.clientSecret);
      } catch (error) {
        toast.error('Failed to initialize payment. Please try again.');
        setClientSecret('pi_mock_client_secret_for_demo');
      }
    };
    if (cart?.items?.length > 0 && selectedAddressId) {
      createRentalAndPaymentIntent();
    }
  }, [cart, total, billingDetails.email, selectedAddressId]);

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
    setIsProcessing(true);

    // Simulate payment for non-card methods
    if (paymentMethod !== 'Card') {
      // Here you would call your backend to create a payment with the selected method
      try {
        // Example: POST /api/payments with method, amount, etc.
        const response = await fetch(`${import.meta.env.VITE_API_URL}/payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            rentalId: 1, // TODO: Replace with actual rentalId after rental creation
            method: paymentMethod,
            amount: total,
            upiId: paymentMethod === 'UPI' ? upiId : undefined,
            walletProvider: paymentMethod === 'Wallet' ? walletProvider : undefined,
            netbankingBank: paymentMethod === 'Netbanking' ? netbankingBank : undefined,
          })
        });
        if (!response.ok) throw new Error('Payment failed');
        await clearCart();
        toast.success('Payment successful! Thank you for your order.');
        navigate('/checkout/success');
      } catch (error) {
        toast.error('Payment failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

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
        toast.error(error.message || 'Payment failed. Please try again.');
      } else if (paymentIntent.status === 'succeeded') {
        // Payment successful
        await clearCart();
        toast.success('Payment successful! Thank you for your order.');
        navigate('/checkout/success');
      }
    } catch (error) {
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
      {/* Address Selection Floating Tab */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6 sticky top-2 z-20">
        <h2 className="text-xl font-semibold mb-4">Select Delivery Address</h2>
        {addressLoading ? <Loader size="md" /> : (
          addresses.length === 0 ? (
            <div className="text-gray-500">No addresses found. <a href="/user/addresses" className="text-blue-700 underline">Add Address</a></div>
          ) : (
            <div className="flex flex-col gap-3">
              {addresses.map(addr => (
                <label key={addr.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedAddressId===addr.id?'border-blue-600 bg-blue-50 shadow':'border-gray-200 hover:border-blue-400'}`}>
                  <input type="radio" name="address" value={addr.id} checked={selectedAddressId===addr.id} onChange={()=>setSelectedAddressId(addr.id)} className="accent-blue-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-blue-700">{addr.name} {addr.isDefault && <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Default</span>}</div>
                    <div className="text-gray-700 text-sm">{addr.addressLine1}, {addr.addressLine2}, {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}</div>
                    <div className="text-gray-500 text-xs">Phone: {addr.phone}</div>
                  </div>
                </label>
              ))}
            </div>
          )
        )}
      </div>
      
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
            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <div className="flex flex-wrap gap-4">
                {paymentMethods.map((method) => (
                  <label key={method.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      className="accent-blue-600"
                    />
                    {method.label}
                  </label>
                ))}
              </div>
            </div>
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

            {/* Conditional Payment Fields */}
            {paymentMethod === 'Card' && (
              <div>
                <label className="block text-sm font-medium mb-1">Card Details</label>
                <div className="border rounded-lg p-3 bg-gray-50">
                  <CardElement options={cardElementOptions} />
                </div>
              </div>
            )}
            {paymentMethod === 'UPI' && (
              <div>
                <label className="block text-sm font-medium mb-1">UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="example@upi"
                  required
                />
              </div>
            )}
            {paymentMethod === 'Wallet' && (
              <div>
                <label className="block text-sm font-medium mb-1">Wallet Provider</label>
                <input
                  type="text"
                  name="walletProvider"
                  value={walletProvider}
                  onChange={e => setWalletProvider(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paytm, PhonePe, etc."
                  required
                />
              </div>
            )}
            {paymentMethod === 'Netbanking' && (
              <div>
                <label className="block text-sm font-medium mb-1">Bank Name</label>
                <input
                  type="text"
                  name="netbankingBank"
                  value={netbankingBank}
                  onChange={e => setNetbankingBank(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="HDFC, SBI, ICICI, etc."
                  required
                />
              </div>
            )}
            {paymentMethod === 'COD' && (
              <div className="text-yellow-700 bg-yellow-100 p-3 rounded">
                <span>Cash on Delivery selected. Please pay the amount to the delivery agent.</span>
              </div>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || (paymentMethod === 'Card' && (!stripe || !elements))}
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
