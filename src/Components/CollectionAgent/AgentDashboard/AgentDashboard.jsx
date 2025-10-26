import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AgentDashboard.css';

const AgentDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    upcomingPayments: [],
    assignedLoans: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/collection-agent/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Mock data for demonstration
      setDashboardData({
        upcomingPayments: [
          {
            id: 1,
            loanId: 'LN001',
            customerName: 'Rahul Sharma',
            dueDate: '2024-01-15',
            amountDue: 15000,
            customerPhone: '9876543210'
          },
          {
            id: 2,
            loanId: 'LN002',
            customerName: 'Priya Patel',
            dueDate: '2024-01-16',
            amountDue: 12000,
            customerPhone: '9876543211'
          }
        ],
        assignedLoans: [
          {
            id: 'LN001',
            customerName: 'Rahul Sharma',
            loanAmount: 500000,
            outstandingBalance: 350000,
            nextDueDate: '2024-01-15',
            status: 'ACTIVE'
          },
          {
            id: 'LN002',
            customerName: 'Priya Patel',
            loanAmount: 300000,
            outstandingBalance: 180000,
            nextDueDate: '2024-01-16',
            status: 'ACTIVE'
          }
        ],
        stats: {
          totalLoans: 15,
          upcomingPayments: 8,
          overduePayments: 3,
          totalCollection: 125000
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getPaymentStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'Overdue', class: 'overdue' };
    if (diffDays <= 3) return { status: 'Due Soon', class: 'due-soon' };
    return { status: 'Upcoming', class: 'upcoming' };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="agent-dashboard">
      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3 className="stat-title">Total Assigned Loans</h3>
            <p className="stat-number">{dashboardData.stats.totalLoans || 0}</p>
            <Link to="/agent/assigned-loans" className="stat-link">View All →</Link>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3 className="stat-title">Today's Collection</h3>
            <p className="stat-number">{formatCurrency(dashboardData.stats.totalCollection)}</p>
            <Link to="/agent/summary" className="stat-link">View Summary →</Link>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3 className="stat-title">Upcoming Payments</h3>
            <p className="stat-number">{dashboardData.stats.upcomingPayments || 0}</p>
            <Link to="/agent/pending" className="stat-link">View Details →</Link>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3 className="stat-title">Overdue Payments</h3>
            <p className="stat-number">{dashboardData.stats.overduePayments || 0}</p>
            <Link to="/agent/pending" className="stat-link">Take Action →</Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="action-buttons-grid">
          <Link to="/agent/assigned-loans" className="action-btn">
            <span className="action-icon">📋</span>
            <span className="action-text">View All Loans</span>
          </Link>
          <Link to="/agent/actions" className="action-btn">
            <span className="action-icon">💰</span>
            <span className="action-text">Record Payment</span>
          </Link>
          <Link to="/agent/pending" className="action-btn">
            <span className="action-icon">⚠️</span>
            <span className="action-text">Pending Dues</span>
          </Link>
          <Link to="/agent/summary" className="action-btn">
            <span className="action-icon">📊</span>
            <span className="action-text">Today's Summary</span>
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-content-grid">
        {/* Upcoming Payments */}
        <div className="content-card">
          <div className="card-header">
            <h3>Upcoming Due Payments</h3>
            <Link to="/agent/pending" className="view-all-link">View All →</Link>
          </div>
          <div className="table-container">
            {dashboardData.upcomingPayments.length === 0 ? (
              <div className="no-data">
                <div className="empty-icon">📅</div>
                <p>No upcoming payments</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th>Customer</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.upcomingPayments.slice(0, 5).map(payment => {
                    const statusInfo = getPaymentStatus(payment.dueDate);
                    return (
                      <tr key={payment.id}>
                        <td className="loan-id">#{payment.loanId}</td>
                        <td>
                          <div className="customer-info">
                            <div className="customer-name">{payment.customerName}</div>
                            <div className="customer-phone">{payment.customerPhone}</div>
                          </div>
                        </td>
                        <td className="due-date">{formatDate(payment.dueDate)}</td>
                        <td className="amount">{formatCurrency(payment.amountDue)}</td>
                        <td>
                          <span className={`status-badge ${statusInfo.class}`}>
                            {statusInfo.status}
                          </span>
                        </td>
                        <td>
                          <button className="collect-btn">Collect</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Assigned Loans */}
        <div className="content-card">
          <div className="card-header">
            <h3>Recent Assigned Loans</h3>
            <Link to="/agent/assigned-loans" className="view-all-link">View All →</Link>
          </div>
          <div className="table-container">
            {dashboardData.assignedLoans.length === 0 ? (
              <div className="no-data">
                <div className="empty-icon">📝</div>
                <p>No assigned loans</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th>Customer</th>
                    <th>Loan Amount</th>
                    <th>Outstanding</th>
                    <th>Next Due</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.assignedLoans.slice(0, 5).map(loan => (
                    <tr key={loan.id}>
                      <td className="loan-id">#{loan.id}</td>
                      <td className="customer-name">{loan.customerName}</td>
                      <td className="amount">{formatCurrency(loan.loanAmount)}</td>
                      <td className="amount">{formatCurrency(loan.outstandingBalance)}</td>
                      <td className="next-due">{formatDate(loan.nextDueDate)}</td>
                      <td>
                        <span className={`status-badge ${loan.status.toLowerCase()}`}>
                          {loan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;