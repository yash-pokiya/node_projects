import axiosInstance from './axiosInstance';

export const getSubjects = async (includeInactive = false) => {
  const response = await axiosInstance.get(`/subjects?includeInactive=${includeInactive}`);
  return response.data;
};

export const getSubjectById = async (id) => {
  const response = await axiosInstance.get(`/subjects/${id}`);
  return response.data;
};

export const createSubject = async (subjectData) => {
  const response = await axiosInstance.post('/subjects', subjectData);
  return response.data;
};

export const updateSubject = async (id, subjectData) => {
  const response = await axiosInstance.patch(`/subjects/${id}`, subjectData);
  return response.data;
};

export const deleteSubject = async (id) => {
  const response = await axiosInstance.delete(`/subjects/${id}`);
  return response.data;
};
