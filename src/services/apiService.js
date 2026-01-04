import { loanService } from './loanService';
import { attendanceService } from './attendanceService';

// Comprehensive API service combining all available endpoints
export const apiService = {
  // Authentication
  login: loanService.login,
  logout: loanService.logout,
  updateProfile: loanService.updateProfile,

  // Customer Management
  getCustomers: loanService.getCustomers,
  createCustomer: loanService.createCustomer,
  searchCustomers: loanService.searchCustomers,

  // Loan Management
  getLoans: loanService.getLoans,
  getLoanById: loanService.getLoanById,
  createLoan: loanService.createLoan,
  approveLoan: loanService.approveLoan,
  rejectLoan: loanService.rejectLoan,

  // Loan Schedules & Collections
  getLoanSchedules: loanService.getLoanSchedules,
  assignLoanSchedule: loanService.assignLoanSchedule,
  collectPayment: loanService.collectPayment,

  // Documents
  uploadLoanDocuments: loanService.uploadLoanDocuments,
  getLoanDocuments: loanService.getLoanDocuments,
  deleteDocument: loanService.deleteDocument,

  // Disbursements
  getDisbursements: loanService.getDisbursements,
  createDisbursement: loanService.createDisbursement,
  getDisbursementDetails: loanService.getDisbursementDetails,

  // User & Role Management
  getUsers: loanService.getUsers,
  getCollectionAgents: loanService.getCollectionAgents,
  createAgent: loanService.createAgent,
  updateUserRole: loanService.updateUserRole,
  getRoles: loanService.getRoles,
  getPermissions: loanService.getPermissions,
  createRole: loanService.createRole,
  updateRole: loanService.updateRole,
  deleteRole: loanService.deleteRole,
  createPermission: loanService.createPermission,
  inviteUser: loanService.inviteUser,

  // Attendance
  checkIn: attendanceService.checkIn,
  checkOut: attendanceService.checkOut,
  getAttendance: attendanceService.getAttendance,
  createAttendance: attendanceService.createAttendance,

  // Collections & Reports
  getDailyCollections: loanService.getDailyCollections,
  getCollectionReports: loanService.getCollectionReports,
  getPerformanceReports: loanService.getPerformanceReports,
  getTargetReports: loanService.getTargetReports,

  // Notifications
  getNotifications: loanService.getNotifications,
  markNotificationRead: loanService.markNotificationRead,
  sendBulkNotifications: loanService.sendBulkNotifications,

  // Audit
  getAuditLogs: loanService.getAuditLogs,
  createAuditLog: loanService.createAuditLog,

  // Loan Types
  getLoanTypes: loanService.getLoanTypes,
};

export default apiService;