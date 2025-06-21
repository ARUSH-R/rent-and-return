import React, { createContext, useEffect, useState } from 'react';
import { getToken, removeToken } from '../utils/tokenUtils';
import AuthService from '../services/AuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Auto-load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = getToken();
      if (token) {
        try {
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
        } catch {
          removeToken();
          setUser(null);
        }
      }
    };

    loadUser();
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
