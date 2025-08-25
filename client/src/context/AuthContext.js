import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // Check if token is valid and set current user
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Set default headers for all requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user profile
          const res = await api.get('/api/users/profile');
          
          // Decode token to check expiration
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token expired
            logout();
          } else {
            setCurrentUser(res.data.data);
          }
        } catch (error) {
          console.error('Error verifying token', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, [token]);

  // Login user
  const login = async (credentials) => {
    const res = await api.post('/api/auth/login', credentials);
    setToken(res.data.token);
    setCurrentUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    return res.data;
  };

  // Register user
  const register = async (userData) => {
    const res = await api.post('/api/auth/register', userData);
    setToken(res.data.token);
    setCurrentUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    return res.data;
  };

  // Logout user
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  // Update user profile
  const updateProfile = async (userData) => {
    const res = await api.put('/api/users/profile', userData);
    setCurrentUser(res.data.data);
    return res.data;
  };

  // Change password
  const changePassword = async (passwordData) => {
    const res = await api.put('/api/users/password', passwordData);
    return res.data;
  };

  const value = {
    currentUser,
    token,
    isLoading,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
