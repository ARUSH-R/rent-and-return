import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, removeToken, setToken, decodeToken } from "../utils/tokenUtils";
import { login as apiLogin, register as apiRegister } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = getToken();
    return token ? decodeToken(token) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keeps user state in sync with token changes
  useEffect(() => {
    const token = getToken();
    setUser(token ? decodeToken(token) : null);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const data = await apiLogin(email, password);
      setToken(data.token);
      setUser(decodeToken(data.token));
      setLoading(false);
      return true;
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Login failed"
      );
      setLoading(false);
      return false;
    }
  };

  const register = async (form) => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRegister(form);
      setToken(data.token);
      setUser(decodeToken(data.token));
      setLoading(false);
      return true;
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed"
      );
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role?.toLowerCase() === "admin"
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};