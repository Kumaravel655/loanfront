import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PendingDues.css';

const PendingDues = () => {
  const [pendingDues, setPendingDues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingDues();
  }, []);

  const fetchPendingDues = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/collection-agent/pending-dues', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingDues(response.data);
    } catch (error) {
      console.error('Error fetching pending dues:', error);
      // Mock data
      setPendingDues([
        {
          id: 1,
          loanId: 'LN001',
          customerName: 'Rahul Sharma',
          customerPhone: '9876543210',
          dueDate: '2024-01-10',
          amountDue: 15000,
          overdueDays: 5,
          status: 'OVERDUE'
        },
        {
          id: 2,
          loanId: 'LN003',
          customerName: 'Amit Kumar',
          customerPhone: '9876543212',
          dueDate: '2024-01-12',
          amountDue: 20000,
          overdueDays: 3,
          status: 'OVERDUE'
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

  if (loading) {
    return <div className="loading">Loading pending dues...</div>;
  }

  return (
    <div className="pending-dues">
      <div className="page-header">
        <h1>Pending & Overdue Dues</h1>
        <div className="header-stats">
          <span className="stat">Total: {pendingDues.length}</span>
          <span className="stat overdue-count">
            Overdue: {pendingDues.filter(due => due.status === 'OVERDUE').length}
          </span>
        </div>
      </div>

      <div className="dues-list">
        {pendingDues.length === 0 ? (
          <div className="no-data">No pending dues found</div>
        ) : (
          <div className="table-container">
            <table className="dues-table">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Customer Details</th>
                  <th>Due Date</th>
                  <th>Overdue Days</th>
                  <th>Amount Due</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDues.map(due => (
                  <tr key={due.id} className={due.status.toLowerCase()}>
                    <td className="loan-id">#{due.loanId}</td>
                    <td>
                      <div className="customer-details">
                        <div className="customer-name">{due.customerName}</div>
                        <div className="customer-phone">{due.customerPhone}</div>
                      </div>
                    </td>
                    <td>{formatDate(due.dueDate)}</td>
                    <td>
                      {due.overdueDays > 0 ? (
                        <span className="overdue-days">{due.overdueDays} days</span>
                      ) : (
                        <span className="due-today">Due Today</span>
                      )}
                    </td>
                    <td className="amount">{formatCurrency(due.amountDue)}</td>
                    <td>
                      <span className={`status-badge ${due.status.toLowerCase()}`}>
                        {due.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-primary">Call</button>
                        <button className="btn btn-secondary">Visit</button>
                        <button className="btn btn-success">Collect</button>
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

export default PendingDues;