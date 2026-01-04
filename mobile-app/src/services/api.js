import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
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
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['token', 'user', 'isAuthenticated']);
    }
    return Promise.reject(error);
  }
);

export const endpoints = {
  login: '/auth/login/',
  logout: '/auth/logout/',
  signup: '/auth/signup/',
  users: '/auth/users/',
  collectionAgents: '/auth/agents/',
  customers: '/auth/customers/',
  loans: '/auth/loans/',
  loanSchedules: '/auth/loan-schedules/',
  dailyCollections: '/daily-collections/',
  notifications: '/notifications/',
};

export default api;