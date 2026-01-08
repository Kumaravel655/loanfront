import React, { useState, useEffect } from 'react';
import { loanService } from '../../../services/loanService';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDollarSign, FaClock, FaExclamationTriangle, FaChartBar, FaCalendarAlt, FaCheckCircle, FaClipboardList, FaHistory, FaSync, FaHandPaper, FaArrowUp, FaUsers, FaBullseye } from 'react-icons/fa';
import './AgentDashboard.css';

const AgentDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    todayCollection: 0,
    pendingDues: 0,
    overdueLoans: 0,
    assignedLoans: 0,
    completionRate: 0,
    recentCollections: [],
    upcomingDues: [],
    loading: false,
    error: null
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setDashboardData(prev => ({ ...prev, loading: true }));
    
    try {
      // Fetch all required data in parallel
      const [schedules, collections, loans] = await Promise.all([
        loanService.getLoanSchedules(),
        loanService.getDailyCollections(),
        loanService.getLoans()
      ]);
      
      const today = new Date().toISOString().split('T')[0];
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Filter schedules for current user
      const userSchedules = schedules.filter(schedule => 
        schedule.assigned_to === currentUser?.id
      );
      
      // Calculate comprehensive metrics
      const todaySchedules = userSchedules.filter(s => s.due_date === today);
      const pendingSchedules = userSchedules.filter(s => s.status === 'pending');
      const overdueSchedules = userSchedules.filter(s => 
        new Date(s.due_date) < new Date() && s.status === 'pending'
      );
      const completedSchedules = userSchedules.filter(s => s.status === 'done');
      
      // Today's collection from completed schedules
      const todayCollection = todaySchedules
        .filter(s => s.status === 'done')
        .reduce((sum, s) => sum + parseFloat(s.total_due || 0), 0);
      
      // Total pending amount
      const pendingDues = pendingSchedules
        .reduce((sum, s) => sum + parseFloat(s.total_due || 0), 0);
      
      // Success rate calculation
      const completionRate = userSchedules.length > 0 
        ? Math.round((completedSchedules.length / userSchedules.length) * 100)
        : 0;
      
      // Upcoming dues (next 7 days, sorted by urgency)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const upcomingDues = pendingSchedules
        .filter(s => new Date(s.due_date) <= nextWeek)
        .sort((a, b) => {
          // Sort by overdue first, then by due date
          const aOverdue = new Date(a.due_date) < new Date();
          const bOverdue = new Date(b.due_date) < new Date();
          if (aOverdue && !bOverdue) return -1;
          if (!aOverdue && bOverdue) return 1;
          return new Date(a.due_date) - new Date(b.due_date);
        })
        .slice(0, 8);
      
      // Recent collections with more details
      const recentCollections = completedSchedules
        .sort((a, b) => new Date(b.updated_at || b.due_date) - new Date(a.updated_at || a.due_date))
        .slice(0, 6);
      
      setDashboardData({
        todayCollection,
        pendingDues,
        overdueLoans: overdueSchedules.length,
        assignedLoans: userSchedules.length,
        completionRate,
        recentCollections,
        upcomingDues,
        loading: false,
        error: null
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load dashboard data'
      }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (dashboardData.loading) {
    return (
      <div className="agent-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="agent-dashboard">
        <div className="error-container">
          <div className="error-icon"><FaExclamationTriangle style={{fontSize: '48px', color: '#dc3545'}} /></div>
          <h3>Error Loading Dashboard</h3>
          <p>{dashboardData.error}</p>
          <button onClick={fetchDashboardData} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-dashboard">
      {/* Header Section */}
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <div className="header-text">
            <h1>Collection Dashboard</h1>
            <p>Track your daily collections and manage assigned loans</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-label">Active Loans</span>
              <span className="stat-value">{dashboardData.assignedLoans}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Success Rate</span>
              <span className="stat-value">{dashboardData.completionRate}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <motion.div 
          className="metric-card collection"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="metric-header">
            <div className="metric-icon collection-icon"><FaDollarSign /></div>
            <div className="metric-trend"><FaArrowUp /></div>
          </div>
          <div className="metric-content">
            <p className="metric-value">{formatCurrency(dashboardData.todayCollection)}</p>
            <h3>Today's Collection</h3>
            <span className="metric-change">+12% from yesterday</span>
          </div>
        </motion.div>

        <motion.div 
          className="metric-card pending"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="metric-header">
            <div className="metric-icon pending-icon"><FaClock /></div>
            <div className="metric-count">{dashboardData.upcomingDues.length}</div>
          </div>
          <div className="metric-content">
            <p className="metric-value">{formatCurrency(dashboardData.pendingDues)}</p>
            <h3>Pending Amount</h3>
            <span className="metric-change">Due this week</span>
          </div>
        </motion.div>

        <motion.div 
          className="metric-card overdue"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="metric-header">
            <div className="metric-icon overdue-icon"><FaExclamationTriangle /></div>
            <div className="metric-alert">{dashboardData.overdueLoans > 0 ? '!' : ''}</div>
          </div>
          <div className="metric-content">
            <p className="metric-value">{dashboardData.overdueLoans}</p>
            <h3>Overdue Loans</h3>
            <span className="metric-change">Requires attention</span>
          </div>
        </motion.div>

        <motion.div 
          className="metric-card performance"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="metric-header">
            <div className="metric-icon performance-icon"><FaBullseye /></div>
            <div className="metric-progress">
              <div className="progress-ring" style={{'--progress': dashboardData.completionRate}}></div>
            </div>
          </div>
          <div className="metric-content">
            <p className="metric-value">{dashboardData.completionRate}%</p>
            <h3>Success Rate</h3>
            <span className="metric-change">This month</span>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Priority Tasks */}
        <motion.div 
          className="priority-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="section-header">
            <h2>Priority Collections</h2>
            <span className="section-subtitle">Requires immediate attention</span>
          </div>
          <div className="priority-grid">
            {dashboardData.upcomingDues.slice(0, 3).map((due, index) => (
              <div key={due.id || due.due_date} className="priority-card">
                <div className="priority-header">
                  <div className="priority-badge">Due {formatDate(due.due_date)}</div>
                  <div className="priority-amount">{formatCurrency(due.total_due)}</div>
                </div>
                <div className="priority-details">
                  <span className="customer-name">Customer #{due.loan_id || 'N/A'}</span>
                  <span className="loan-type">Personal Loan</span>
                </div>
                <Link to={`/agent/collect/${due.loan_id}`} className="collect-btn">
                  Collect Now
                </Link>
              </div>
            ))}
            {dashboardData.upcomingDues.length === 0 && (
              <div className="empty-priority">
                <FaCheckCircle className="empty-icon" />
                <p>All caught up!</p>
                <span>No urgent collections pending</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div 
          className="activity-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="section-header">
            <h2>Recent Activity</h2>
            <Link to="/agent/history" className="view-all-link">View All</Link>
          </div>
          <div className="activity-feed">
            {dashboardData.recentCollections.length > 0 ? (
              dashboardData.recentCollections.map((collection, index) => (
                <div key={collection.id || index} className="activity-item">
                  <div className="activity-icon success">
                    <FaCheckCircle />
                  </div>
                  <div className="activity-content">
                    <div className="activity-main">
                      <span className="activity-text">Payment collected</span>
                      <span className="activity-amount">{formatCurrency(collection.total_due)}</span>
                    </div>
                    <div className="activity-meta">
                      <span className="activity-date">{formatDate(collection.due_date)}</span>
                      <span className="activity-separator">•</span>
                      <span className="activity-customer">Loan #{collection.loan_id || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-activity">
                <FaHistory className="empty-icon" />
                <p>No recent activity</p>
                <span>Collections will appear here</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        className="actions-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="actions-grid">
          <Link to="/agent/assigned-loans" className="action-card primary">
            <div className="action-icon"><FaClipboardList /></div>
            <div className="action-content">
              <h3>Assigned Loans</h3>
              <p>View all your assigned collections</p>
              <span className="action-count">{dashboardData.assignedLoans} loans</span>
            </div>
          </Link>
          <Link to="/agent/pending" className="action-card secondary">
            <div className="action-icon"><FaClock /></div>
            <div className="action-content">
              <h3>Pending Dues</h3>
              <p>Collections awaiting payment</p>
              <span className="action-count">{formatCurrency(dashboardData.pendingDues)}</span>
            </div>
          </Link>
          <Link to="/agent/history" className="action-card tertiary">
            <div className="action-icon"><FaHistory /></div>
            <div className="action-content">
              <h3>Collection History</h3>
              <p>View past collection records</p>
              <span className="action-count">{dashboardData.recentCollections.length} recent</span>
            </div>
          </Link>
          <button className="action-card refresh" onClick={fetchDashboardData}>
            <div className="action-icon"><FaSync /></div>
            <div className="action-content">
              <h3>Refresh Data</h3>
              <p>Update dashboard information</p>
              <span className="action-count">Real-time sync</span>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AgentDashboard;