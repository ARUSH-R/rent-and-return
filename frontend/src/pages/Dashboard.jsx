import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

/**
 * Dashboard Page
 * - Shows a summary of user information and quick links.
 * - Admins see product/rental management shortcuts.
 */
const Dashboard = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Please log in to access the dashboard.</div>
        <Link to="/login" className="text-blue-700 hover:underline mt-4 inline-block">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-8">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 mb-3">
            {(user?.username || user?.email)?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="font-semibold text-lg text-blue-700">{user?.username || user?.email}</div>
          <div className="text-gray-600">{user?.email}</div>
          <Link
            to="/user/profile"
            className="mt-4 bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition"
          >
            View Profile
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="font-bold text-2xl text-blue-700 mb-2">0</div>
          <div className="mb-4 text-gray-600">Orders</div>
          <Link
            to="/orders"
            className="bg-blue-50 text-blue-700 px-4 py-2 rounded font-semibold hover:bg-blue-100 transition"
          >
            View Orders
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="font-bold text-2xl text-blue-700 mb-2">0</div>
          <div className="mb-4 text-gray-600">My Rentals</div>
          <Link
            to="/rentals"
            className="bg-blue-50 text-blue-700 px-4 py-2 rounded font-semibold hover:bg-blue-100 transition"
          >
            View Rentals
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-blue-700 mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/cart" className="text-blue-700 hover:underline">
                Go to Cart
              </Link>
            </li>
            <li>
              <Link to="/feedback" className="text-blue-700 hover:underline">
                Give Feedback
              </Link>
            </li>
            <li>
              <Link to="/products" className="text-blue-700 hover:underline">
                Browse Products
              </Link>
            </li>
            <li>
              <Link to="/rentals" className="text-blue-700 hover:underline">
                Browse Rentals
              </Link>
            </li>
            <li>
              <Link to="/user/settings" className="text-blue-700 hover:underline">
                Account Settings
              </Link>
            </li>
          </ul>
        </div>
        {isAdmin && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-blue-700 mb-4">Admin Shortcuts</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products/new" className="text-blue-700 hover:underline">
                  Add Product
                </Link>
              </li>
              <li>
                <Link to="/rentals/new" className="text-blue-700 hover:underline">
                  Add Rental
                </Link>
              </li>
              <li>
                <Link to="/feedbacks" className="text-blue-700 hover:underline">
                  View Feedbacks
                </Link>
              </li>
              <li>
                <Link to="/admin/orders" className="text-blue-700 hover:underline">
                  Manage Orders
                </Link>
              </li>
              <li>
                <Link to="/admin/users" className="text-blue-700 hover:underline">
                  Manage Users
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;