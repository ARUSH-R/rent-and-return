import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContextUtils";
import Loader from "../../components/Loader";

/**
 * Cart Page
 * - Displays cart items, total, and checkout action.
 * - Uses CartContext for state management.
 */
const Cart = () => {
  const { cart, isLoading, removeFromCart, clearCart } = useCart();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="mb-6">Add some products to your cart to get started!</p>
        <Link
          to="/products"
          className="inline-block mt-4 px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const total = (cart.items || []).reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Your Cart</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <ul className="divide-y divide-gray-200">
          {(cart.items || []).map((item) => (
            <li key={item.id} className="py-4 flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 object-cover rounded border"
              />
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-gray-500 text-sm">
                  Qty: {item.quantity}
                </div>
              </div>
              <div className="text-right min-w-[90px]">
                <div className="font-bold text-blue-700">
                  ₹{(item.price || 0) * (item.quantity || 0)}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-red-600 hover:underline mt-1"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={clearCart}
            className="text-sm text-red-700 hover:underline"
          >
            Clear Cart
          </button>
          <div className="text-xl font-bold text-blue-700">
            Total: ₹{total}
          </div>
        </div>
        <Link
          to="/checkout"
          className="block w-full mt-8 py-3 bg-blue-700 text-white text-lg font-semibold rounded hover:bg-blue-800 transition text-center"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;