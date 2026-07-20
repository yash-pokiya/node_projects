import axiosInstance from './axiosInstance';

export const getUniversities = (q = '') => {
  return axiosInstance.get(`/onboarding/universities?q=${encodeURIComponent(q)}`);
};

export const createUniversity = (payload) => {
  return axiosInstance.post('/onboarding/universities', payload);
};

export const getColleges = (universityId) => {
  return axiosInstance.get(`/onboarding/colleges?universityId=${universityId}`);
};

export const createCollege = (payload) => {
  return axiosInstance.post('/onboarding/colleges', payload);
};

export const getCourses = (collegeId) => {
  return axiosInstance.get(`/onboarding/courses?collegeId=${collegeId}`);
};

export const createCourse = (payload) => {
  return axiosInstance.post('/onboarding/courses', payload);
};

export const getSemesters = (courseId) => {
  return axiosInstance.get(`/onboarding/semesters?courseId=${courseId}`);
};

export const createSemester = (payload) => {
  return axiosInstance.post('/onboarding/semesters', payload);
};

export const submitOnboarding = (payload) => {
  return axiosInstance.post('/onboarding/submit', payload);
};
