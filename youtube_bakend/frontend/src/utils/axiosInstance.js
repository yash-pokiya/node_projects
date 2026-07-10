import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Relative path to use Vite proxy
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for catching 401s and refreshing tokens if needed
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isAuthRoute = 
      originalRequest.url?.includes("/user/profile") ||
      originalRequest.url?.includes("/user/refresh-access-token") ||
      originalRequest.url?.includes("/user/login") ||
      originalRequest.url?.includes("/user/register");

    // If error is 401, we haven't retried yet, and it's not an auth route
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh token
        await axios.post(
          "/api/user/refresh-access-token",
          {},
          { withCredentials: true }
        );
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token expired or failed
        // Redirect to login if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
