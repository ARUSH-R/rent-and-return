import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Usage:
 * <RequireAuth>...protected content...</RequireAuth>
 * <RequireAuth admin>...admin content...</RequireAuth>
 */
const RequireAuth = ({ children, admin = false }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, saving the current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (admin && user?.role?.toLowerCase() !== "admin") {
    // Not authorized for admin pages
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;