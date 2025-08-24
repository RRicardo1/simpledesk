import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Configure axios defaults - FIXED for localhost development
const API_BASE_URL = process.env.REACT_APP_API_URL || 
                     process.env.REACT_APP_API_BASE_URL || 
                     process.env.API_URL ||
                     'http://localhost:3001/api'; // Changed to localhost for development
axios.defaults.baseURL = API_BASE_URL;

console.log('🔧 API Base URL set to:', API_BASE_URL);

// Add request interceptor to include auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// DISABLED: Add response interceptor to handle auth errors - causing reload issues
// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Only redirect to login if we're not already on login/register page
//       const currentPath = window.location.pathname;
//       if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
//         console.log('401 auth error detected, redirecting to login');
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Debug logging for auth state changes
  console.log('AuthProvider state:', { user: !!user, loading, timestamp: new Date().toISOString() });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Skip token validation during development due to backend issues
          // await axios.get('/auth/me');
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (organizationName, email, password, firstName, lastName) => {
    try {
      const response = await axios.post('/auth/register', {
        organizationName,
        email,
        password,
        firstName,
        lastName
      });
      
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/auth/profile', profileData);
      const updatedUser = { ...user, ...response.data.user };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Profile update failed' 
      };
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};