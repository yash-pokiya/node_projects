import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/axiosInstance";
import { toast } from "react-hot-toast";

const VideoContext = createContext();

export const useVideo = () => useContext(VideoContext);

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/video/get-all");
      setVideos(data.data || []);
    } catch (error) {
      console.error("Failed to fetch videos", error);
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const uploadVideo = async (formData) => {
    try {
      const { data } = await api.post("/video/upload-video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(data.message || "Video uploaded successfully!");
      fetchVideos(); // Refresh list
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
      throw error;
    }
  };

  return (
    <VideoContext.Provider value={{ videos, loading, fetchVideos, uploadVideo }}>
      {children}
    </VideoContext.Provider>
  );
};
