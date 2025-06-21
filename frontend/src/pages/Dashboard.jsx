import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

/**
 * Dashboard Page
 * - Shows a summary of user information, orders, rentals, and quick links.
 * - Admins see product/rental management shortcuts.
 */
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // TODO: Replace with actual admin logic
  const isAdmin = window.localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      fetch("/api/user/profile").then((res) => {
        if (!res.ok) throw new Error("Failed to load user");
        return res.json();
      }),
      fetch("/api/dashboard/summary").then((res) => {
        if (!res.ok) throw new Error("Failed to load summary");
        return res.json();
      })
    ])
      .then(([userData, summaryData]) => {
        setUser(userData);
        setSummary(summaryData);
      })
      .catch((err) => setError(err.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-12">{error}</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-8">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 mb-3">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="font-semibold text-lg text-blue-700">{user?.name}</div>
          <div className="text-gray-600">{user?.email}</div>
          <Link
            to="/user/profile"
            className="mt-4 bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition"
          >
            View Profile
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="font-bold text-2xl text-blue-700 mb-2">{summary?.orders ?? "--"}</div>
          <div className="mb-4 text-gray-600">Orders</div>
          <Link
            to="/orders"
            className="bg-blue-50 text-blue-700 px-4 py-2 rounded font-semibold hover:bg-blue-100 transition"
          >
            View Orders
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="font-bold text-2xl text-blue-700 mb-2">{summary?.rentals ?? "--"}</div>
          <div className="mb-4 text-gray-600">My Rentals</div>
          <Link
            to="/user/my-rentals"
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