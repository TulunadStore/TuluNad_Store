// src/contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

// Create the context
// CORRECTED: Added 'export' so this can be imported by class components
export const AuthContext = createContext();

// Custom hook to use the auth context easily in other components
export const useAuth = () => {
  return useContext(AuthContext);
};

// The provider component that will wrap the application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // To track initial auth status check
  const [token, setToken] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  /**
   * A centralized function to update the authentication state.
   * It handles setting state, updating localStorage, and configuring axios headers.
   */
  const setAuthState = useCallback((userData, userToken) => {
    if (userData && userToken) {
      // --- User is logging in ---
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      setUser(userData);
      setToken(userToken);
      setIsAuthenticated(true);
      // CRITICAL: Set the default Authorization header for all future Axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      console.log('AuthContext: State updated - Logged in. Axios header set.');
    } else {
      // --- User is logging out ---
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      // CRITICAL: Clear the Authorization header
      delete axios.defaults.headers.common['Authorization'];
      console.log('AuthContext: State updated - Logged out. Axios header cleared.');
    }
  }, []);

  // Effect to check for a saved user session in localStorage on initial app load
  useEffect(() => {
    const loadUserFromLocalStorage = () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
          setAuthState(JSON.parse(storedUser), storedToken);
        } else {
          setAuthState(null, null);
        }
      } catch (error) {
        console.error("AuthContext: Error loading user from local storage:", error);
        setAuthState(null, null);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromLocalStorage();
  }, [setAuthState]);

  /**
   * Handles user login.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<object>} A promise that resolves to an object with success status and message.
   */
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { user, token } = response.data;
      setAuthState(user, token);
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Handles new user registration.
   * @param {object} userData - Object containing firstName, lastName, email, and password.
   * @returns {Promise<object>} A promise that resolves to an object with success status and message.
   */
  const signup = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
       // After successful signup, we don't automatically log them in.
       // We show a success message and they can proceed to the login page.
      toast.success(response.data.message || 'Signup successful! Please log in.');
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Logs the user out.
   */
  const logout = useCallback(() => {
    setAuthState(null, null);
    toast('You have been logged out.', { icon: '👋' });
  }, [setAuthState]);

  // The value provided to all consumer components of this context.
  const value = {
    user,
    isAuthenticated,
    loading,
    token,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
