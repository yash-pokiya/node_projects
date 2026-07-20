import { create } from 'zustand';
import * as authApi from '../api/authApi';
import { setAccessToken } from '../api/axiosInstance';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setToken: (token) => {
    set({ accessToken: token });
    setAccessToken(token);
  },

  setLoading: (isLoading) => set({ isLoading }),

  login: async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      const { user, accessToken } = response.data;
      
      set({ user, accessToken, isAuthenticated: true });
      setAccessToken(accessToken);
      return response;
    } catch (error) {
      throw error;
    }
  },

  signup: async (name, email, password) => {
    try {
      const response = await authApi.signup(name, email, password);
      const { user, accessToken } = response.data;
      
      set({ user, accessToken, isAuthenticated: true });
      setAccessToken(accessToken);
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Invalidate client side even if server call fails
    } finally {
      set({ user: null, accessToken: null, isAuthenticated: false });
      setAccessToken(null);
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // Try to refresh access token on boot using HTTP cookie
      const response = await authApi.refresh();
      const { user, accessToken } = response.data;
      
      set({ user, accessToken, isAuthenticated: true, isLoading: false });
      setAccessToken(accessToken);
    } catch (error) {
      // Invalidate if boot verification fails
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      setAccessToken(null);
    }
  },

  updateUserInStore: (updatedUser) => {
    set({ user: updatedUser });
  }
}));
