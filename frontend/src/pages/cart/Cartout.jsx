import { Link } from "react-router-dom";

/**
 * Cartout Page (Checkout Success)
 * - Shows a thank you message after successful checkout
 * - Offers navigation back to products or dashboard
 */
const Cartout = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-lg w-full text-center">
        <svg
          className="mx-auto mb-4 h-16 w-16 text-green-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-3xl font-bold mb-3 text-green-700">Thank you for your order!</h2>
        <p className="text-gray-600 mb-8">
          Your checkout was successful. You will receive a confirmation email soon.<br />
          We appreciate your business!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="flex-1 py-2 px-6 bg-blue-700 text-white rounded font-semibold hover:bg-blue-800 transition"
          >
            Continue Shopping
          </Link>
          <Link
            to="/dashboard"
            className="flex-1 py-2 px-6 border border-blue-700 text-blue-700 rounded font-semibold hover:bg-blue-50 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cartout;