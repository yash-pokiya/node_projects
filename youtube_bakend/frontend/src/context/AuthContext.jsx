import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/axiosInstance";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data } = await api.get("/user/profile");
      setUser(data.data.currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await api.post("/user/login", credentials);
      setUser(data.data.user);
      toast.success(data.message || "Logged in successfully!");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await api.post("/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(data.message || "Registered successfully! Please login.");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/user/logout");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
