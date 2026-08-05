import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    let errorMsg = 'Something went wrong';

    if (error.response && error.response.data && error.response.data.msg) {
      errorMsg = error.response.data.msg;
    } else if (error.message) {
      errorMsg = error.message;
    }

    if (status === 401) {
      // Dispatch custom logout event to reset state and clear token
      localStorage.removeItem('token');
      window.dispatchEvent(new CustomEvent('app-logout'));
    } else if (status === 403) {
      errorMsg = 'You are not authorized to perform this action.';
    } else if (status === 500) {
      errorMsg = 'Server error, try again';
    }

    // Dispatch global error event for the snackbar notification
    const event = new CustomEvent('app-snackbar', {
      detail: {
        message: errorMsg,
        severity: 'error',
      },
    });
    window.dispatchEvent(event);

    return Promise.reject(error);
  }
);

export default axiosInstance;
