import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loanService } from '../../../services/loanService';
import { FaUsers, FaDollarSign, FaExclamationTriangle, FaChartBar, FaChartLine, FaCog, FaHandPaper, FaCalendarAlt, FaSync } from 'react-icons/fa';
import './StaffOverview.css';

const StaffOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [agents, collections, loans, schedules] = await Promise.all([
        loanService.getCollectionAgents().catch(() => []),
        loanService.getDailyCollections().catch(() => []),
        loanService.getLoans().catch(() => []),
        loanService.getLoanSchedules().catch(() => [])
      ]);

      // Calculate stats from real data
      const today = new Date().toISOString().split('T')[0];
      const todayCollections = collections.filter(c => c.collection_date === today);
      const totalCollections = todayCollections.reduce((sum, c) => 
        sum + parseFloat(c.cash_total || 0) + parseFloat(c.upi_total || 0) + parseFloat(c.card_total || 0), 0
      );
      
      const overdueSchedules = schedules.filter(s => 
        new Date(s.due_date) < new Date() && s.status === 'pending'
      );
      
      const activeAgents = agents.filter(a => a.is_active).length;
      const delinquencyRate = schedules.length > 0 ? (overdueSchedules.length / schedules.length * 100).toFixed(1) : 0;

      // Generate recent activity from collections
      const recentActivity = todayCollections.slice(0, 3).map((collection, index) => {
        const agent = agents.find(a => a.id === collection.agent_id);
        const amount = parseFloat(collection.cash_total || 0) + parseFloat(collection.upi_total || 0) + parseFloat(collection.card_total || 0);
        return {
          id: index + 1,
          agent: agent?.username || agent?.first_name || 'Unknown Agent',
          action: 'Collection recorded',
          amount: amount,
          time: new Date(collection.collection_date).toLocaleDateString()
        };
      });

      setDashboardData({
        stats: {
          totalAgents: agents.length,
          activeAgents: activeAgents,
          totalCollections: totalCollections,
          overdueAccounts: overdueSchedules.length,
          delinquencyRate: parseFloat(delinquencyRate)
        },
        recentActivity: recentActivity.length > 0 ? recentActivity : [
          { id: 1, agent: 'No recent activity', action: '', amount: 0, time: 'Today' }
        ]
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to empty data
      setDashboardData({
        stats: {
          totalAgents: 0,
          activeAgents: 0,
          totalCollections: 0,
          overdueAccounts: 0,
          delinquencyRate: 0
        },
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return <div className="loading">Loading staff overview...</div>;
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="staff-overview">
      {/* Welcome Section */}
      <motion.div 
        className="welcome-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="welcome-content">
          <h1>Welcome back, {user?.username || 'Staff Manager'}! <FaHandPaper /></h1>
          <p>Monitor your team's performance and manage collection operations</p>
        </div>
        <div className="date-info">
          <span><FaCalendarAlt style={{marginRight: '8px'}} />{new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <motion.div 
          className="stat-card primary"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-content">
            <h3>Total Agents</h3>
            <p className="stat-number">{dashboardData.stats.totalAgents}</p>
            <span className="stat-subtitle">{dashboardData.stats.activeAgents} active</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="stat-icon"><FaDollarSign /></div>
          <div className="stat-content">
            <h3>Today's Collection</h3>
            <p className="stat-number">{formatCurrency(dashboardData.stats.totalCollections)}</p>
            <span className="stat-subtitle">Total collected</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card warning"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="stat-icon"><FaExclamationTriangle /></div>
          <div className="stat-content">
            <h3>Overdue Accounts</h3>
            <p className="stat-number">{dashboardData.stats.overdueAccounts}</p>
            <span className="stat-subtitle">Need attention</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card info"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="stat-icon"><FaChartBar /></div>
          <div className="stat-content">
            <h3>Delinquency Rate</h3>
            <p className="stat-number">{dashboardData.stats.delinquencyRate}%</p>
            <span className="stat-subtitle">Overall rate</span>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats and Recent Activity */}
      <div className="content-grid">
        <motion.div 
          className="recent-activity"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {dashboardData.recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-avatar">{activity.agent.charAt(0)}</div>
                <div className="activity-details">
                  <div className="activity-text">
                    <strong>{activity.agent}</strong> {activity.action}
                  </div>
                  <div className="activity-meta">
                    <span className="activity-amount">{formatCurrency(activity.amount)}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/staff/agents" className="view-all-link">View All Activity →</Link>
        </motion.div>

        <motion.div 
          className="quick-actions"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/staff/agents" className="action-btn primary">
              <FaUsers style={{marginRight: '8px'}} /> Manage Agents
            </Link>
            <Link to="/staff/reports" className="action-btn secondary">
              <FaChartBar style={{marginRight: '8px'}} /> Generate Reports
            </Link>
            <Link to="/staff/performance" className="action-btn secondary">
              <FaChartLine style={{marginRight: '8px'}} /> View Performance
            </Link>
            <button className="action-btn tertiary" onClick={fetchDashboardData}>
              <FaSync style={{marginRight: '8px'}} /> Refresh Data
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffOverview;