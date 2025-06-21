import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

const ProtectedRoute = ({ roles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (roles.length && !roles.includes(user.role)) {
    // Role mismatch (e.g., non-admin trying to access admin page)
    return <Navigate to="/forbidden" replace />;
  }

  // Access granted
  return <Outlet />;
};

export default ProtectedRoute;
