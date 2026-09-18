import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('smartcrop_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('smartcrop_auth_token');
    if (token) {
      apiService.getMe()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('smartcrop_user', JSON.stringify(userData));
        })
        .catch(() => {
          apiService.logout();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await apiService.login({ email, password });
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, farmName) => {
    const data = await apiService.register({ name, email, password, farm_name: farmName });
    setUser(data.user);
    return data;
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
