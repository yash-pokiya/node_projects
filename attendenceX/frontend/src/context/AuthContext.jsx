import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance, { setAccessToken, registerLogoutCallback } from '../api/axiosInstance';
import { useTheme } from './ThemeContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setTheme } = useTheme();

  // Helper to sync theme from user model
  const syncUserTheme = (userData) => {
    if (userData && userData.theme) {
      setTheme(userData.theme);
    }
  };

  // Check auth state on application startup
  const checkAuth = async () => {
    try {
      // Call the token refresh endpoint to see if a valid session exists in cookies
      const response = await axiosInstance.post('/auth/refresh');
      const { accessToken, user: userData } = response.data.data;
      
      setAccessToken(accessToken);
      setUser(userData);
      syncUserTheme(userData);
    } catch (error) {
      // No active session or expired refresh token
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Register callback for when Axios encounters a failed token refresh
    registerLogoutCallback(() => {
      setUser(null);
      setAccessToken(null);
    });
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { accessToken, user: userData } = response.data.data;

      setAccessToken(accessToken);
      setUser(userData);
      syncUserTheme(userData);
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, error: errMsg };
    }
  };

  // Signup handler
  const signup = async (name, email, password) => {
    try {
      const response = await axiosInstance.post('/auth/signup', { name, email, password });
      const { accessToken, user: userData } = response.data.data;

      setAccessToken(accessToken);
      setUser(userData);
      syncUserTheme(userData);
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Signup failed. Please try again.';
      return { success: false, error: errMsg };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  // Update profile handler (Phase 2 profile edits)
  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    syncUserTheme(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUserState,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
