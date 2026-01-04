import api from './api';

export const attendanceService = {
  // Check-in
  checkIn: async () => {
    try {
      const response = await api.post('/auth/attendance/checkin/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check in');
    }
  },

  // Check-out
  checkOut: async () => {
    try {
      const response = await api.post('/auth/attendance/checkout/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check out');
    }
  },

  // Get attendance records
  getAttendance: async () => {
    try {
      const response = await api.get('/auth/attendance/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch attendance');
    }
  },

  // Create attendance record
  createAttendance: async (attendanceData) => {
    try {
      const response = await api.post('/auth/attendance/', attendanceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create attendance');
    }
  }
};