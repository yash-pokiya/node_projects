import axiosInstance from './axiosInstance';

export const getTimetable = async () => {
  const response = await axiosInstance.get('/timetable');
  return response.data;
};

export const createTimetableEntry = async (entryData) => {
  const response = await axiosInstance.post('/timetable', entryData);
  return response.data;
};

export const updateTimetableEntry = async (id, entryData) => {
  const response = await axiosInstance.patch(`/timetable/${id}`, entryData);
  return response.data;
};

export const deleteTimetableEntry = async (id) => {
  const response = await axiosInstance.delete(`/timetable/${id}`);
  return response.data;
};
