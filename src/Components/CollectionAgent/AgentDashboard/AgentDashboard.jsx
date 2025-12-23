import React, { useState, useEffect } from 'react';
import { loanService } from '../../../services/loanService';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDollarSign, FaClock, FaExclamationTriangle, FaChartBar, FaCalendarAlt, FaCheckCircle, FaClipboardList, FaHistory, FaSync, FaHandPaper } from 'react-icons/fa';
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
    try {
      // Fetch assigned loan schedules for current agent
      const schedules = await loanService.getLoanSchedules();
      const today = new Date().toISOString().split('T')[0];
      
      // Filter schedules for current user
      const userSchedules = schedules.filter(schedule => 
        schedule.assigned_to === user?.id
      );
      
      // Calculate metrics
      const todaySchedules = userSchedules.filter(s => s.due_date === today);
      const pendingSchedules = userSchedules.filter(s => s.status === 'pending');
      const overdueSchedules = userSchedules.filter(s => 
        new Date(s.due_date) < new Date() && s.status === 'pending'
      );
      const completedSchedules = userSchedules.filter(s => s.status === 'done');
      
      const todayCollection = todaySchedules
        .filter(s => s.status === 'done')
        .reduce((sum, s) => sum + parseFloat(s.total_due || 0), 0);
      
      const pendingDues = pendingSchedules
        .reduce((sum, s) => sum + parseFloat(s.total_due || 0), 0);
      
      const completionRate = userSchedules.length > 0 
        ? Math.round((completedSchedules.length / userSchedules.length) * 100)
        : 0;
      
      // Get upcoming dues (next 7 days)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const upcomingDues = pendingSchedules
        .filter(s => new Date(s.due_date) <= nextWeek)
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 5);
      
      setDashboardData({
        todayCollection,
        pendingDues,
        overdueLoans: overdueSchedules.length,
        assignedLoans: userSchedules.length,
        completionRate,
        recentCollections: completedSchedules.slice(0, 5),
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
      style: 'currency',
      currency: 'INR',
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
      {/* Welcome Section */}
      <motion.div 
        className="welcome-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="welcome-content">
          <h1>Welcome back, {user?.username || 'Agent'}! <FaHandPaper /></h1>
          <p>Here's your collection overview for today</p>
        </div>
        <div className="date-info">
          <span>{new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <motion.div 
          className="metric-card primary"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="metric-icon"><FaDollarSign /></div>
          <div className="metric-content">
            <h3>Today's Collection</h3>
            <p className="metric-value">{formatCurrency(dashboardData.todayCollection)}</p>
            <span className="metric-label">Collected today</span>
          </div>
        </motion.div>

        <motion.div 
          className="metric-card warning"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="metric-icon"><FaClock /></div>
          <div className="metric-content">
            <h3>Pending Dues</h3>
            <p className="metric-value">{formatCurrency(dashboardData.pendingDues)}</p>
            <span className="metric-label">Amount pending</span>
          </div>
        </motion.div>

        <motion.div 
          className="metric-card danger"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="metric-icon"><FaExclamationTriangle /></div>
          <div className="metric-content">
            <h3>Overdue Loans</h3>
            <p className="metric-value">{dashboardData.overdueLoans}</p>
            <span className="metric-label">Loans overdue</span>
          </div>
        </motion.div>

        <motion.div 
          className="metric-card success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="metric-icon"><FaChartBar /></div>
          <div className="metric-content">
            <h3>Completion Rate</h3>
            <p className="metric-value">{dashboardData.completionRate}%</p>
            <span className="metric-label">Collection rate</span>
          </div>
        </motion.div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Upcoming Dues */}
        <motion.div 
          className="dashboard-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="card-header">
            <h3><FaCalendarAlt style={{marginRight: '8px'}} /> Upcoming Dues</h3>
            <span className="card-subtitle">Next 7 days</span>
          </div>
          <div className="card-content">
            {dashboardData.upcomingDues.length > 0 ? (
              <div className="dues-list">
                {dashboardData.upcomingDues.map((due) => (
                  <div key={due.id || due.due_date} className="due-item">
                    <div className="due-info">
                      <span className="due-date">{formatDate(due.due_date)}</span>
                      <span className="due-amount">{formatCurrency(due.total_due)}</span>
                    </div>
                    <div className="due-status">
                      <span className={`status-badge ${due.status}`}>
                        {due.status === 'pending' ? 'Pending' : 'Done'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No upcoming dues</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Collections */}
        <motion.div 
          className="dashboard-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="card-header">
            <h3><FaCheckCircle style={{marginRight: '8px'}} /> Recent Collections</h3>
            <span className="card-subtitle">Latest completed</span>
          </div>
          <div className="card-content">
            {dashboardData.recentCollections.length > 0 ? (
              <div className="collections-list">
                {dashboardData.recentCollections.map((collection) => (
                  <div key={collection.id || collection.due_date} className="collection-item">
                    <div className="collection-info">
                      <span className="collection-date">{formatDate(collection.due_date)}</span>
                      <span className="collection-amount">{formatCurrency(collection.total_due)}</span>
                    </div>
                    <div className="collection-status">
                      <span className="status-badge success">Collected</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No recent collections</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        className="quick-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <Link to="/agent/assigned-loans" className="action-btn primary">
            <span className="action-icon"><FaClipboardList /></span>
            <span>View Assigned Loans</span>
          </Link>
          <Link to="/agent/pending" className="action-btn secondary">
            <span className="action-icon"><FaClock /></span>
            <span>Pending Collections</span>
          </Link>
          <Link to="/agent/history" className="action-btn tertiary">
            <span className="action-icon"><FaHistory /></span>
            <span>Collection History</span>
          </Link>
          <button className="action-btn quaternary" onClick={fetchDashboardData}>
            <span className="action-icon"><FaSync /></span>
            <span>Refresh Data</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AgentDashboard;