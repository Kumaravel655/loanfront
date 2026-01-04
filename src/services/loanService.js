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

  // Get assigned loan schedules for current agent
  getAssignedLoans: async () => {
    try {
      const response = await api.get(`${endpoints.loanSchedules}assigned/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assigned loans');
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
      const response = await api.post(`${endpoints.loanSchedules}${scheduleId}/collect/`, {
        payment_method: paymentData.payment_method || 'cash',
        paid_amount: paymentData.amount || paymentData.paid_amount
      });
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

  // Update customer
  updateCustomer: async (id, customerData) => {
    try {
      const response = await api.put(`${endpoints.customers}${id}/`, customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update customer');
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    try {
      const response = await api.delete(`${endpoints.customers}${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete customer');
    }
  },

  // Get loan types
  getLoanTypes: async () => {
    try {
      const response = await api.get('/auth/loan-types/');
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
      const response = await api.post('/auth/register/', {
        username: agentData.username,
        email: agentData.email,
        password: agentData.password || 'defaultPassword123',
        role: 'collection_agent'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create agent');
    }
  },

  // Get daily collections
  getDailyCollections: async (params = {}) => {
    try {
      const response = await api.get('/auth/daily-collections/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch daily collections');
    }
  },

  // Get notifications
  getNotifications: async (userId = null) => {
    try {
      const params = userId ? { user_id: userId } : {};
      const response = await api.get('/auth/notifications/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  },

  // Mark notification as read
  markNotificationRead: async (notificationId) => {
    try {
      const response = await api.patch(`/auth/notifications/${notificationId}/`, {
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

  // Get loan documents
  getLoanDocuments: async (id) => {
    try {
      const response = await api.get(`${endpoints.loans}${id}/documents/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch documents');
    }
  },

  // Delete document
  deleteDocument: async (documentId) => {
    try {
      const response = await api.delete(`/auth/documents/${documentId}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete document');
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile/', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Search customers
  searchCustomers: async (searchTerm) => {
    try {
      const response = await api.get(`${endpoints.customers}search/?q=${searchTerm}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search customers');
    }
  },

  // Approve loan
  approveLoan: async (loanId, approvalData) => {
    try {
      const response = await api.post(`${endpoints.loans}${loanId}/approve/`, approvalData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to approve loan');
    }
  },

  // Reject loan
  rejectLoan: async (loanId, rejectionData) => {
    try {
      const response = await api.post(`${endpoints.loans}${loanId}/reject/`, rejectionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reject loan');
    }
  },

  // Get disbursements
  getDisbursements: async (params = {}) => {
    try {
      const response = await api.get('/auth/disbursements/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch disbursements');
    }
  },

  // Create disbursement
  createDisbursement: async (disbursementData) => {
    try {
      const response = await api.post('/auth/disbursements/', disbursementData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create disbursement');
    }
  },

  // Get disbursement details
  getDisbursementDetails: async (id) => {
    try {
      const response = await api.get(`/auth/disbursements/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch disbursement details');
    }
  },

  // Get audit logs
  getAuditLogs: async (params = {}) => {
    try {
      const response = await api.get('/auth/audit-logs/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch audit logs');
    }
  },

  // Create audit log
  createAuditLog: async (logData) => {
    try {
      const response = await api.post('/auth/audit-logs/', logData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create audit log');
    }
  },

  // Create role
  createRole: async (roleData) => {
    try {
      const response = await api.post('/auth/roles/', roleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create role');
    }
  },

  // Update role
  updateRole: async (roleId, roleData) => {
    try {
      const response = await api.put(`/auth/roles/${roleId}/`, roleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update role');
    }
  },

  // Delete role
  deleteRole: async (roleId) => {
    try {
      const response = await api.delete(`/auth/roles/${roleId}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete role');
    }
  },

  // Create permission
  createPermission: async (permissionData) => {
    try {
      const response = await api.post('/auth/permissions/', permissionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create permission');
    }
  },

  // Invite user
  inviteUser: async (inviteData) => {
    try {
      const response = await api.post('/auth/users/invite/', inviteData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to invite user');
    }
  },

  // Send bulk notifications
  sendBulkNotifications: async (notificationData) => {
    try {
      const response = await api.post('/auth/notifications/bulk/', notificationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send bulk notifications');
    }
  },

  // Get collection reports
  getCollectionReports: async (params = {}) => {
    try {
      const response = await api.get('/auth/reports/collections/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch collection reports');
    }
  },

  // Get performance reports
  getPerformanceReports: async (params = {}) => {
    try {
      const response = await api.get('/auth/reports/performance/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch performance reports');
    }
  },

  // Get target reports
  getTargetReports: async (params = {}) => {
    try {
      const response = await api.get('/auth/reports/targets/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch target reports');
    }
  },
};