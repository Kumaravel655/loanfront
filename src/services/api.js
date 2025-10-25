import axios from 'axios';

// The base URL for your backend API
const API_URL = 'http://localhost:8000/api'; // Adjust if your backend runs elsewhere

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the JWT token to every request
api.interceptors.request.use(
  (config) => {
    // Retrieve the token from local storage or your state manager
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;