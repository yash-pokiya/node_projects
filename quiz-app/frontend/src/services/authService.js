import axiosInstance from '../api/axios';

const authService = {
  register: (data) => {
    return axiosInstance.post('/auth/register', data);
  },
  
  login: (data) => {
    return axiosInstance.post('/auth/login', data);
  },
  
  getMe: () => {
    return axiosInstance.get('/auth/me');
  },
};

export default authService;
