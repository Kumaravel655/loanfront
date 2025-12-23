import React, { useState, useEffect } from 'react';
import { loanService } from '../../services/loanService';
import { FaBriefcase, FaTimes } from 'react-icons/fa';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const LoanManagement = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [editData, setEditData] = useState({});

  const handleView = async (loanId) => {
    try {
      const loanDetails = await loanService.getLoanById(loanId);
      setSelectedLoan(loanDetails);
      setModalType('view');
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching loan details:', error);
    }
  };

  const handleEdit = (loan) => {
    setSelectedLoan(loan);
    setEditData({
      customer_name: loan.customer?.full_name,
      principal_amount: loan.principal_amount,
      loan_status: loan.loan_status
    });
    setModalType('edit');
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      // Update the loan in the local state
      const updatedLoans = loans.map(loan => 
        loan.loan_id === selectedLoan.loan_id 
          ? { 
              ...loan, 
              customer: { ...loan.customer, full_name: editData.customer_name },
              principal_amount: Number(editData.principal_amount),
              loan_status: editData.loan_status 
            }
          : loan
      );
      setLoans(updatedLoans);
      setShowModal(false);
      setSelectedLoan(null);
      setEditData({});
    } catch (error) {
      console.error('Error saving loan:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLoan(null);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await loanService.getLoans();
      setLoans(response || []);
    } catch (error) {
      console.error('Error fetching loans:', error);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.customer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         String(loan.loan_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         String(loan.customer?.customer_id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.loan_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'closed': return '#17a2b8';
      case 'defaulted': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '16px', color: '#666' }}>Loading loans...</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px'
      }}>
        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: '28px',
          fontWeight: '700',
          color: '#2d3748'
        }}>
          <FaBriefcase style={{marginRight: '8px'}} /> Loan Management
        </h1>
        <p style={{
          margin: 0,
          color: '#718096',
          fontSize: '16px'
        }}>
          Manage all loans, view loan details, and track loan status
        </p>
      </div>

      {/* Filters */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search by customer name, loan ID, or customer ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '300px',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'active', 'closed', 'defaulted'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '8px 16px',
                border: '2px solid #e2e8f0',
                background: statusFilter === status ? '#667eea' : 'white',
                color: statusFilter === status ? 'white' : '#374151',
                borderColor: statusFilter === status ? '#667eea' : '#e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Loans Table */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Loan ID</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Customer ID</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Customer</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Amount</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Interest Rate</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Term</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Start Date</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length > 0 ? filteredLoans.map((loan, index) => (
                <tr 
                  key={loan.id || index}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '16px', fontWeight: '600', color: '#2d3748' }}>
                    {loan.loan_id}
                  </td>
                  <td style={{ padding: '16px', fontWeight: '600', color: '#2d3748' }}>
                    {loan.customer?.customer_id || 'N/A'}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#2d3748' }}>
                        {loan.customer?.full_name || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontWeight: '600', color: '#2d3748' }}>
                    ₹{(loan.principal_amount || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '16px', color: '#718096' }}>
                    {loan.interest_percentage || 0}%
                  </td>
                  <td style={{ padding: '16px', color: '#718096' }}>
                    {loan.total_due_count || 0} {loan.repayment_mode}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'white',
                      backgroundColor: getStatusColor(loan.loan_status),
                      textTransform: 'capitalize'
                    }}>
                      {loan.loan_status || 'active'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#718096' }}>
                    {loan.created_at ? new Date(loan.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleView(loan.loan_id)}
                        style={{
                        padding: '6px 12px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>
                        View
                      </button>
                      <button 
                        onClick={() => handleEdit(loan)}
                        style={{
                        padding: '6px 12px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="9" style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#718096'
                  }}>
                    {searchTerm || statusFilter !== 'all' ? 'No loans match your filters' : 'No loans found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedLoan && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>{modalType === 'view' ? 'Loan Details' : 'Edit Loan'}</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
                <FaTimes />
              </button>
            </div>
            
            {modalType === 'view' ? (
              <div>
                <p><strong>Loan ID:</strong> {selectedLoan.loan?.loan_id || selectedLoan.loan_id}</p>
                <p><strong>Customer:</strong> {selectedLoan.loan?.customer?.full_name || selectedLoan.customer?.full_name}</p>
                <p><strong>Amount:</strong> ₹{(selectedLoan.loan?.principal_amount || selectedLoan.principal_amount || 0).toLocaleString()}</p>
                <p><strong>Interest Rate:</strong> {selectedLoan.loan?.interest_percentage || selectedLoan.interest_percentage}%</p>
                <p><strong>Repayment:</strong> {selectedLoan.loan?.total_due_count || selectedLoan.total_due_count} {selectedLoan.loan?.repayment_mode || selectedLoan.repayment_mode}</p>
                <p><strong>Status:</strong> {selectedLoan.loan?.loan_status || selectedLoan.loan_status}</p>
              </div>
            ) : (
              <div>
                <input 
                  type="text" 
                  placeholder="Customer Name" 
                  value={editData.customer_name || ''}
                  onChange={(e) => setEditData({...editData, customer_name: e.target.value})}
                  style={{ width: '100%', padding: '8px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input 
                  type="number" 
                  placeholder="Amount" 
                  value={editData.principal_amount || ''}
                  onChange={(e) => setEditData({...editData, principal_amount: e.target.value})}
                  style={{ width: '100%', padding: '8px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <select 
                  value={editData.loan_status || ''}
                  onChange={(e) => setEditData({...editData, loan_status: e.target.value})}
                  style={{ width: '100%', padding: '8px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="defaulted">Defaulted</option>
                </select>
                <button 
                  onClick={handleSave}
                  style={{
                  padding: '10px 20px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

const LoanManagementWithErrorBoundary = () => (
  <ErrorBoundary>
    <LoanManagement />
  </ErrorBoundary>
);

export default LoanManagementWithErrorBoundary;