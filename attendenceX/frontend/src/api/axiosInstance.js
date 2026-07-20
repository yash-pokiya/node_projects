import axios from 'axios';
import { useToastStore } from '../store/useToastStore';

let accessToken = null;
let isRefreshing = false;
let failedQueue = [];
let onLogoutCallback = null; // Used to trigger logout redirect in UI if refresh fails

export const setAccessToken = (token) => {
  accessToken = token;
};

export const registerLogoutCallback = (cb) => {
  onLogoutCallback = cb;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s request timeout guard
});

// Request interceptor to inject Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to process queued requests after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor to handle token refresh automatically and dispatch error toasts
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and not already retried
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Don't refresh if the error is from the auth refresh/login/signup endpoints
      if (
        originalRequest.url.includes('/auth/login') ||
        originalRequest.url.includes('/auth/signup') ||
        originalRequest.url.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request until token is refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the access token via the httpOnly cookie route
        const response = await axiosInstance.post('/auth/refresh');
        const { accessToken: newAccessToken } = response.data.data;

        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // If refresh fails, clear token, notify user, and redirect
        setAccessToken(null);
        
        useToastStore.getState().showToast(
          'Your session has expired. Please log in again.',
          'warning',
          'Session Expired'
        );

        if (onLogoutCallback) {
          onLogoutCallback();
        }
        return Promise.reject(refreshError);
      }
    }

    // Trigger global error toast unless skipped explicitly by request config
    if (!originalRequest || !originalRequest.skipGlobalToast) {
      const detailsMsg = Array.isArray(error.response?.data?.details) 
        ? error.response.data.details.join(', ') 
        : null;
      const message = detailsMsg || 
                      error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      'An unexpected error occurred.';
      
      let title = 'Error';
      if (!error.response) {
        title = 'Network Connection Lost';
      } else if (error.response.status === 403) {
        title = 'Access Denied';
      } else if (error.response.status >= 500) {
        title = 'Server Error';
      }

      useToastStore.getState().showToast(message, 'error', title);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
