import React, { useEffect, useState } from 'react';
import CartService from '../../services/CartService';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await CartService.getCartItems();
      setCartItems(res.data);
    } catch {
      setError('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await CartService.removeFromCart(productId);
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    } catch {
      alert('Failed to remove item from cart.');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cartItems.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="mt-2 font-semibold">₹{product.price}</p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <Link
              to="/cart/checkout"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Proceed to Checkout ({cartItems.length})
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
