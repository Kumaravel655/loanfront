import api, { endpoints } from './api';

// Loan service functions
export const loanService = {
  // Get all loans with optional filters
  getLoans: async (params = {}) => {
    try {
      const response = await api.get(endpoints.loans, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch loans');
    }
  },

  // Get loan by ID with details
  getLoanById: async (id) => {
    try {
      const response = await api.get(`${endpoints.loans}${id}/details/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch loan details');
    }
  },

  // Create new loan
  createLoan: async (loanData) => {
    try {
      const response = await api.post(endpoints.loans, loanData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create loan');
    }
  },

  // Get loan schedules
  getLoanSchedules: async (loanId = null) => {
    try {
      const url = loanId ? `${endpoints.loanSchedules}loan/${loanId}/` : endpoints.loanSchedules;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch loan schedules');
    }
  },

  // Assign loan schedule to agent
  assignLoanSchedule: async (scheduleId, agentId) => {
    try {
      const response = await api.post(`${endpoints.loanSchedules}${scheduleId}/assign/`, {
        assigned_to: agentId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to assign loan schedule');
    }
  },

  // Collect payment
  collectPayment: async (scheduleId, paymentData) => {
    try {
      const response = await api.post(`${endpoints.loanSchedules}${scheduleId}/collect/`, paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to collect payment');
    }
  },

  // Get customers
  getCustomers: async (params = {}) => {
    try {
      const response = await api.get(endpoints.customers, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch customers');
    }
  },

  // Create customer
  createCustomer: async (customerData) => {
    try {
      const response = await api.post(endpoints.customers, customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create customer');
    }
  },

  // Get loan types
  getLoanTypes: async () => {
    try {
      const response = await api.get(endpoints.loanTypes);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch loan types');
    }
  },

  // Get collection agents
  getCollectionAgents: async () => {
    try {
      const response = await api.get(endpoints.collectionAgents);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch collection agents');
    }
  },

  // Create collection agent
  createAgent: async (agentData) => {
    try {
      const response = await api.post(endpoints.signup, {
        username: agentData.username,
        email: agentData.email,
        password: agentData.password || 'defaultPassword123',
        role: 'collection_agent',
        first_name: agentData.first_name,
        last_name: agentData.last_name,
        phone: agentData.phone,
        region: agentData.region
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create agent');
    }
  },

  // Get daily collections
  getDailyCollections: async (params = {}) => {
    try {
      const response = await api.get(endpoints.dailyCollections, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch daily collections');
    }
  },

  // Get notifications
  getNotifications: async (userId = null) => {
    try {
      const params = userId ? { user_id: userId } : {};
      const response = await api.get(endpoints.notifications, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  },

  // Mark notification as read
  markNotificationRead: async (notificationId) => {
    try {
      const response = await api.patch(`${endpoints.notifications}${notificationId}/`, {
        is_read: true
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
  },

  // Get users
  getUsers: async (params = {}) => {
    try {
      const response = await api.get(endpoints.users, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  // Update user role
  updateUserRole: async (userId, roleData) => {
    try {
      const response = await api.patch(`${endpoints.users}${userId}/`, roleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user role');
    }
  },

  // Get roles
  getRoles: async () => {
    try {
      const response = await api.get(endpoints.roles);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch roles');
    }
  },

  // Get permissions
  getPermissions: async () => {
    try {
      const response = await api.get(endpoints.permissions);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch permissions');
    }
  },

  // Upload documents
  uploadLoanDocuments: async (id, formData) => {
    try {
      const response = await api.post(`${endpoints.loans}${id}/documents/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload documents');
    }
  },
};