import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AssignedLoans.css';

const AssignedLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAssignedLoans();
  }, []);

  const fetchAssignedLoans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/collection-agent/assigned-loans', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching assigned loans:', error);
      // Mock data for demonstration
      setLoans([
        {
          id: 'LN001',
          customerName: 'Rahul Sharma',
          customerPhone: '9876543210',
          loanAmount: 500000,
          outstandingBalance: 350000,
          interestRate: 12,
          tenure: 24,
          nextDueDate: '2024-01-15',
          status: 'ACTIVE',
          emiAmount: 25000
        },
        {
          id: 'LN002', 
          customerName: 'Priya Patel',
          customerPhone: '9876543211',
          loanAmount: 300000,
          outstandingBalance: 180000,
          interestRate: 10,
          tenure: 18,
          nextDueDate: '2024-01-16',
          status: 'ACTIVE',
          emiAmount: 18000
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const filteredLoans = loans.filter(loan => {
    if (filter === 'all') return true;
    return loan.status === filter;
  });

  if (loading) {
    return <div className="loading">Loading assigned loans...</div>;
  }

  return (
    <div className="assigned-loans">
      <div className="page-header">
        <h1>Assigned Loans</h1>
        <div className="header-actions">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Loans</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="loans-grid">
        {filteredLoans.length === 0 ? (
          <div className="no-data">No loans found</div>
        ) : (
          <div className="table-container">
            <table className="loans-table">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Customer Details</th>
                  <th>Loan Amount</th>
                  <th>Outstanding</th>
                  <th>EMI Amount</th>
                  <th>Next Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map(loan => (
                  <tr key={loan.id}>
                    <td className="loan-id">#{loan.id}</td>
                    <td>
                      <div className="customer-details">
                        <div className="customer-name">{loan.customerName}</div>
                        <div className="customer-phone">{loan.customerPhone}</div>
                      </div>
                    </td>
                    <td className="amount">{formatCurrency(loan.loanAmount)}</td>
                    <td className="amount outstanding">{formatCurrency(loan.outstandingBalance)}</td>
                    <td className="amount emi">{formatCurrency(loan.emiAmount)}</td>
                    <td>{formatDate(loan.nextDueDate)}</td>
                    <td>
                      <span className={`status-badge ${loan.status.toLowerCase()}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-primary">View</button>
                        <button className="btn btn-secondary">Collect</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedLoans;