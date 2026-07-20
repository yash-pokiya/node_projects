import axiosInstance from './axiosInstance';

export const signup = async (name, email, password) => {
  const response = await axiosInstance.post(
    '/auth/signup', 
    { name, email, password },
    { skipGlobalToast: true } // Handled inline by the Signup form
  );
  return response.data;
};

export const login = async (email, password) => {
  const response = await axiosInstance.post(
    '/auth/login', 
    { email, password },
    { skipGlobalToast: true } // Handled inline by the Login form
  );
  return response.data;
};

export const refresh = async () => {
  const response = await axiosInstance.post(
    '/auth/refresh',
    {},
    { skipGlobalToast: true } // Prevent initial app load from showing a blank 401 toast
  );
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};
