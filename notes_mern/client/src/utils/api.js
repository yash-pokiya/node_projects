import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // Crucial for sending and receiving HTTP cookies
});

export const registerUser = async (username, email, password) => {
  const response = await API.post("/user/register", { username, email, password });
  return response.data;
};

export const loginUser = async (identifier, password) => {
  // Support both username and email by sending identifier to both fields.
  // The backend controller finds users matching email OR username.
  const response = await API.post("/user/login", { 
    email: identifier, 
    username: identifier, 
    password 
  });
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.post("/user/logout");
  return response.data;
};

export const getTodos = async () => {
  const response = await API.get("/todo/gettodo");
  return response.data;
};

export const createTodo = async (title, content) => {
  const response = await API.post("/todo/create", { title, content });
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await API.delete(`/todo/delete/${id}`);
  return response.data;
};

export const updateTodo = async (id, title, content) => {
  const response = await API.patch(`/todo/update/${id}`, { title, content });
  return response.data;
};

export default API;
