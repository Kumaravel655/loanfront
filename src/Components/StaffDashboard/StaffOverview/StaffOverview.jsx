import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StaffOverview.css';

const StaffOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData({
        stats: {
          totalAgents: 25,
          activeAgents: 18,
          totalCollections: 254000,
          overdueAccounts: 12,
          delinquencyRate: 8.5
        },
        recentActivity: [
          { id: 1, agent: 'Priya Sharma', action: 'Exceeded target', amount: 15200, time: '2 hours ago' },
          { id: 2, agent: 'Ravi Kumar', action: 'Collection recorded', amount: 12450, time: '3 hours ago' },
          { id: 3, agent: 'Rahul Dev', action: 'Account marked overdue', amount: 3200, time: '5 hours ago' }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

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

  return (
    <div className="staff-overview">
      <div className="overview-header">
        <h1>Staff Overview</h1>
        <p>Manage your team and monitor performance</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Agents</h3>
            <p className="stat-number">{dashboardData.stats.totalAgents}</p>
            <span className="stat-subtitle">{dashboardData.stats.activeAgents} active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Today's Collection</h3>
            <p className="stat-number">{formatCurrency(dashboardData.stats.totalCollections)}</p>
            <span className="stat-subtitle">Total collected</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Overdue Accounts</h3>
            <p className="stat-number">{dashboardData.stats.overdueAccounts}</p>
            <span className="stat-subtitle">Need attention</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Delinquency Rate</h3>
            <p className="stat-number">{dashboardData.stats.delinquencyRate}%</p>
            <span className="stat-subtitle">Overall rate</span>
          </div>
        </div>
      </div>

      {/* Quick Stats and Recent Activity */}
      <div className="content-grid">
        <div className="recent-activity">
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
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/staff/agents" className="action-btn primary">
              👥 Manage Agents
            </Link>
            <Link to="/staff/reports" className="action-btn secondary">
              📊 Generate Reports
            </Link>
            <Link to="/staff/performance" className="action-btn secondary">
              📈 View Performance
            </Link>
            <button className="action-btn tertiary">
              ⚙️ Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffOverview;