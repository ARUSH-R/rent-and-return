import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user); // user must include role
  };

  const register = async (data) => {
    const res = await axios.post('/auth/register', data);
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user); // user must include role
  };

  const logout = async () => {
    localStorage.removeItem('accessToken');
    try {
      await axios.post('/auth/logout');
    } catch (e) {
      console.error('Logout failed:', e.message);
    }
    setUser(null);
  };

  useEffect(() => {
    const validate = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const res = await axios.get('/users/token/validate?token=' + token);
          setUser(res.data); // assumes { id, name, email, role, etc. }
        }
      } catch (e) {
        logout();
      }
    };
    validate();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
