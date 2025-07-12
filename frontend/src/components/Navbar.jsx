import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between z-20 sticky top-0">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-blue-700 tracking-tight">
          RentReturn
        </Link>
        {isAuthenticated && (
          <div className="hidden md:flex gap-4 ml-8 text-gray-700 font-medium">
            <Link
              to="/dashboard"
              className="hover:text-blue-700 transition"
            >
              Dashboard
            </Link>
            <Link to="/products" className="hover:text-blue-700 transition">
              Products
            </Link>
            <Link to="/rentals" className="hover:text-blue-700 transition">
              Rentals
            </Link>
            <Link to="/cart" className="hover:text-blue-700 transition">
              Cart
            </Link>
            <Link to="/feedback" className="hover:text-blue-700 transition">
              Feedback
            </Link>
            {user?.role?.toLowerCase() === "admin" && (
              <Link to="/admin" className="hover:text-blue-700 transition">
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="py-1 px-4 text-blue-700 font-semibold rounded hover:underline"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="py-1 px-4 bg-blue-700 text-white font-semibold rounded hover:bg-blue-800 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-gray-700 font-medium">
              Hi, {user?.username || user?.email}
              {user?.role ? (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold uppercase">
                  {user.role}
                </span>
              ) : null}
            </span>
            <button
              onClick={handleLogout}
              className="py-1 px-4 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;