import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold hover:text-blue-400">
          RENTRETURN
        </Link>
        {user && (
          <>
            <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
            <Link to="/products" className="hover:text-blue-300">Products</Link>
            <Link to="/rentals" className="hover:text-blue-300">Rentals</Link>
            <Link to="/cart" className="hover:text-blue-300">Cart</Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/login" className="hover:text-blue-300">Login</Link>
            <Link to="/register" className="hover:text-blue-300">Register</Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-300">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
