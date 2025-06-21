import React from "react";
import { Link } from "react-router-dom";

/**
 * Home Page
 * - Welcome landing page with links to main sections.
 */
const Home = () => {
  // TODO: Replace with actual user/auth logic
  const isLoggedIn = !!window.localStorage.getItem("token");
  const isAdmin = window.localStorage.getItem("isAdmin") === "true";

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4 text-center">
          Welcome to CampusMart!
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Your one-stop platform for buying, renting, and sharing essentials on campus.<br />
          Explore products, manage your rentals, and connect with the community.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <Link
            to="/products"
            className="bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition"
          >
            Browse Products
          </Link>
          <Link
            to="/rentals"
            className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition"
          >
            Browse Rentals
          </Link>
          {isLoggedIn && (
            <Link
              to="/dashboard"
              className="bg-blue-100 text-blue-700 px-6 py-2 rounded font-semibold hover:bg-blue-200 transition"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
        {!isLoggedIn && (
          <div className="flex gap-3 mt-2">
            <Link
              to="/login"
              className="text-blue-700 underline hover:text-blue-900 font-medium"
            >
              Login
            </Link>
            <span className="text-gray-400">or</span>
            <Link
              to="/register"
              className="text-blue-700 underline hover:text-blue-900 font-medium"
            >
              Register
            </Link>
          </div>
        )}
        <div className="w-full mt-8">
          <h2 className="text-xl font-bold text-blue-700 mb-3">Why CampusMart?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Affordable products and rentals for students</li>
            <li>Easy-to-use platform for managing your essentials</li>
            <li>Secure transactions and trusted community</li>
            <li>Exclusive deals and offers for campus members</li>
          </ul>
        </div>
        {isAdmin && (
          <div className="w-full mt-8">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Admin Shortcuts</h3>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/products/new"
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded font-medium hover:bg-blue-200 transition"
              >
                Add Product
              </Link>
              <Link
                to="/rentals/new"
                className="bg-green-100 text-green-700 px-4 py-2 rounded font-medium hover:bg-green-200 transition"
              >
                Add Rental
              </Link>
              <Link
                to="/feedbacks"
                className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded font-medium hover:bg-yellow-200 transition"
              >
                View Feedbacks
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;