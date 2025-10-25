import api from './api';

// Fetches a list of all loans, with optional filters
const getLoans = (params) => {
  return api.get('/loans/', { params }); // e.g., { status: 'pending' }
};

// Fetches details for a single loan by its ID
const getLoanById = (id) => {
  return api.get(`/loans/${id}/`);
};

// Creates a new loan application
const createLoan = (loanData) => {
  return api.post('/loans/', loanData);
};

// Uploads documents for a specific loan
const uploadLoanDocuments = (id, formData) => {
  // formData is used for file uploads
  return api.post(`/loans/${id}/documents/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const loanService = {
  getLoans,
  getLoanById,
  createLoan,
  uploadLoanDocuments,
};