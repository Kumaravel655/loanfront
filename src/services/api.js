import axios from 'axios';

// The base URL for your backend API
const API_URL = 'http://127.0.0.1:8000/api'; // Match your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Use 'token' as per your login component
    if (token) {
      config.headers.Authorization = `Token ${token}`; // Django Token auth format
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  login: '/auth/login/',
  logout: '/auth/logout/',
  signup: '/auth/signup/',
  changePassword: '/auth/change-password/',
  
  // Users
  users: '/auth/users/',
  collectionAgents: '/auth/agents/',
  roles: '/auth/roles/',
  permissions: '/auth/permissions/',
  
  // Core entities
  customers: '/auth/customers/',
  loanTypes: '/loan-types/',
  loans: '/auth/loans/',
  loanDues: '/loan-dues/',
  loanSchedules: '/auth/loan-schedules/',
  
  // Collections
  dailyCollections: '/daily-collections/',
  attendance: '/attendance/',
  notifications: '/notifications/',
};

export default api;