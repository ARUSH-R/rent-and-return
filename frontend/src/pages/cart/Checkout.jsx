import React, { useEffect, useState } from 'react';
import CartService from '../../services/CartService';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [dates, setDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    CartService.getCartItems()
      .then((res) => {
        setCartItems(res.data);
        const initialDates = {};
        res.data.forEach((item) => {
          initialDates[item.id] = {
            startDate: '',
            endDate: '',
          };
        });
        setDates(initialDates);
      })
      .catch(() => setError('Failed to load cart for checkout.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDateChange = (productId, field, value) => {
    setDates((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleCheckout = async () => {
    const rentalData = [];

    for (const product of cartItems) {
      const { startDate, endDate } = dates[product.id] || {};
      if (!startDate || !endDate) {
        return setCheckoutError('Please select dates for all items.');
      }
      if (new Date(endDate) < new Date(startDate)) {
        return setCheckoutError('End date cannot be before start date.');
      }

      rentalData.push({
        productId: product.id,
        startDate,
        endDate,
      });
    }

    try {
      await CartService.checkout(rentalData);
      alert('Checkout successful!');
      navigate('/my-rentals');
    } catch {
      setCheckoutError('Checkout failed. Please try again.');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
  if (cartItems.length === 0)
    return <div className="text-center text-gray-500 mt-4">Your cart is empty.</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

      {checkoutError && <p className="text-red-500 mb-3">{checkoutError}</p>}

      <div className="space-y-6">
        {cartItems.map((product) => (
          <div
            key={product.id}
            className="p-4 border rounded shadow bg-white flex flex-col gap-2"
          >
            <div className="flex items-center gap-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-32 h-24 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="mt-1 font-semibold">₹{product.price}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={dates[product.id]?.startDate || ''}
                  onChange={(e) =>
                    handleDateChange(product.id, 'startDate', e.target.value)
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={dates[product.id]?.endDate || ''}
                  onChange={(e) =>
                    handleDateChange(product.id, 'endDate', e.target.value)
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={handleCheckout}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Confirm & Checkout
        </button>
      </div>
    </div>
  );
};

export default Checkout;
