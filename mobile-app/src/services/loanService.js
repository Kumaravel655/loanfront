import api, { endpoints } from './api';

export const loanService = {
  // Authentication
  login: async (credentials) => {
    const response = await api.post(endpoints.login, credentials);
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post(endpoints.signup, userData);
    return response.data;
  },

  // Loans
  getLoans: async (params = {}) => {
    const response = await api.get(endpoints.loans, { params });
    return response.data;
  },

  getLoanById: async (id) => {
    const response = await api.get(`${endpoints.loans}${id}/details/`);
    return response.data;
  },

  createLoan: async (loanData) => {
    const response = await api.post(endpoints.loans, loanData);
    return response.data;
  },

  // Loan Schedules
  getLoanSchedules: async (loanId = null) => {
    const url = loanId ? `${endpoints.loanSchedules}loan/${loanId}/` : endpoints.loanSchedules;
    const response = await api.get(url);
    return response.data;
  },

  assignLoanSchedule: async (scheduleId, agentId) => {
    const response = await api.post(`${endpoints.loanSchedules}${scheduleId}/assign/`, {
      assigned_to: agentId
    });
    return response.data;
  },

  collectPayment: async (scheduleId, paymentData) => {
    const response = await api.post(`${endpoints.loanSchedules}${scheduleId}/collect/`, paymentData);
    return response.data;
  },

  // Customers
  getCustomers: async (params = {}) => {
    const response = await api.get(endpoints.customers, { params });
    return response.data;
  },

  createCustomer: async (customerData) => {
    const response = await api.post(endpoints.customers, customerData);
    return response.data;
  },

  // Collection Agents
  getCollectionAgents: async () => {
    const response = await api.get(endpoints.collectionAgents);
    return response.data;
  },

  createAgent: async (agentData) => {
    const response = await api.post(endpoints.signup, {
      username: agentData.username,
      email: agentData.email,
      password: agentData.password || 'defaultPassword123',
      role: 'collection_agent',
      first_name: agentData.first_name,
      last_name: agentData.last_name,
      phone: agentData.phone,
    });
    return response.data;
  },

  // Collections
  getDailyCollections: async (params = {}) => {
    const response = await api.get(endpoints.dailyCollections, { params });
    return response.data;
  },

  // Notifications
  getNotifications: async (userId = null) => {
    const params = userId ? { user_id: userId } : {};
    const response = await api.get(endpoints.notifications, { params });
    return response.data;
  },

  markNotificationRead: async (notificationId) => {
    const response = await api.patch(`${endpoints.notifications}${notificationId}/`, {
      is_read: true
    });
    return response.data;
  },

  // Customer Management
  addCustomer: async (customerData) => {
    const response = await api.post(endpoints.customers, customerData);
    return response.data;
  },

  updateCustomer: async (id, customerData) => {
    const response = await api.patch(`${endpoints.customers}${id}/`, customerData);
    return response.data;
  },

  deleteCustomer: async (id) => {
    const response = await api.delete(`${endpoints.customers}${id}/`);
    return response.data;
  },

  // Loan Applications
  createLoanApplication: async (applicationData) => {
    const response = await api.post('/loan-applications/', applicationData);
    return response.data;
  },

  getLoanApplications: async () => {
    const response = await api.get('/loan-applications/');
    return response.data;
  },

  approveLoanApplication: async (id) => {
    const response = await api.patch(`/loan-applications/${id}/approve/`);
    return response.data;
  },

  rejectLoanApplication: async (id, reason) => {
    const response = await api.patch(`/loan-applications/${id}/reject/`, { reason });
    return response.data;
  },

  // Disbursements
  getDisbursements: async () => {
    const response = await api.get('/disbursements/');
    return response.data;
  },

  getPendingDisbursements: async () => {
    const response = await api.get('/disbursements/pending/');
    return response.data;
  },

  disburseLoan: async (loanId) => {
    const response = await api.post(`/loans/${loanId}/disburse/`);
    return response.data;
  },

  // User Management
  getUsers: async () => {
    const response = await api.get('/users/');
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/users/${userId}/`, { role });
    return response.data;
  },

  getRoles: async () => {
    const response = await api.get('/roles/');
    return response.data;
  },

  getPermissions: async () => {
    const response = await api.get('/permissions/');
    return response.data;
  },

  updateRolePermission: async (roleId, permissionId, enabled) => {
    const response = await api.patch(`/roles/${roleId}/permissions/`, { permission_id: permissionId, enabled });
    return response.data;
  },

  // Audit Trail
  getAuditLogs: async (filter = 'all') => {
    const response = await api.get(`/audit-logs/?filter=${filter}`);
    return response.data;
  },

  // Reports
  getCollectionReports: async (params) => {
    const response = await api.get('/reports/collections/', { params });
    return response.data;
  },

  getPerformanceReports: async (params) => {
    const response = await api.get('/reports/performance/', { params });
    return response.data;
  },

  getDisbursementReports: async (params) => {
    const response = await api.get('/reports/disbursements/', { params });
    return response.data;
  },
};