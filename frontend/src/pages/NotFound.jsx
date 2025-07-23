import { Link } from "react-router-dom";

/**
 * NotFound Page
 * - Displays a user-friendly 404 message for unknown routes.
 */
const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow p-8 flex flex-col items-center">
        <h1 className="text-6xl font-bold text-blue-700 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6 text-center">
          The page you&apos;re looking for does not exist.
        </p>
        <Link
          to="/"
          className="bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;