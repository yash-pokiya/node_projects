import axiosInstance from './axiosInstance';

export const markAttendance = async (data) => {
  const response = await axiosInstance.post('/attendance', data);
  return response.data;
};

export const undoLastLog = async () => {
  const response = await axiosInstance.post('/attendance/undo');
  return response.data;
};

export const bulkMarkAttendance = async (entries) => {
  const response = await axiosInstance.post('/attendance/bulk', { entries });
  return response.data;
};

export const getCalendar = async (start, end) => {
  const params = { start, end };
  const response = await axiosInstance.get('/attendance/calendar', { params });
  return response.data;
};

export const getStats = async () => {
  const response = await axiosInstance.get('/attendance/stats');
  return response.data;
};
