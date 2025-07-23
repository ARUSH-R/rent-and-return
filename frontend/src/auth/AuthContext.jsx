import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContextUtils";
import { getToken, removeToken, setToken, decodeToken } from "../utils/tokenUtils";
import AuthService from "../services/AuthService";
const { login: apiLogin, register: apiRegister, getCurrentUser } = AuthService;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = getToken();
    return token ? decodeToken(token) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validate token and fetch user info on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }
    const decoded = decodeToken(token);
    if (!decoded) {
      // Token is invalid or expired
      removeToken();
      setUser(null);
      return;
    }
    // Optionally fetch user info from backend to verify token
    getCurrentUser()
      .then((data) => {
        setUser({ ...decoded, ...data });
      })
      .catch(() => {
        removeToken();
        setUser(null);
      });
  }, []);

  const login = async (identifier, password) => {
    setLoading(true);
    setError("");
    try {
      const data = await apiLogin({ identifier, password });
      setToken(data.token);
      const decoded = decodeToken(data.token);
      // Fetch user info after login
      let userInfo = {};
      try {
        userInfo = await getCurrentUser();
      } catch (e) {
        // intentionally left blank
      }
      setUser({ ...decoded, ...userInfo });
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
