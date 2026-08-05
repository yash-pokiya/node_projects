import axiosInstance from '../api/axios';

const questionService = {
  getAll: (params) => {
    return axiosInstance.get('/questions', { params });
  },

  getById: (id) => {
    return axiosInstance.get(`/questions/${id}`);
  },

  create: (data) => {
    return axiosInstance.post('/questions', data);
  },

  update: (id, data) => {
    return axiosInstance.put(`/questions/${id}`, data);
  },

  delete: (id) => {
    return axiosInstance.delete(`/questions/${id}`);
  },

  getStats: () => {
    return axiosInstance.get('/questions/stats/overview');
  },
};

export default questionService;
