import axiosInstance from '../api/axios';

const quizService = {
  start: () => {
    return axiosInstance.get('/quiz/start');
  },

  submit: (data) => {
    return axiosInstance.post('/quiz/submit', data); // data = { quizId, answers }
  },
};

export default quizService;
