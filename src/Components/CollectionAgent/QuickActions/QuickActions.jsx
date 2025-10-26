import React, { useState } from 'react';
import './QuickActions.css';

const QuickActions = () => {
  const [activeAction, setActiveAction] = useState(null);

  const quickActions = [
    {
      id: 1,
      title: 'Record Payment',
      icon: '💰',
      description: 'Record a new payment collection',
      action: '/record-payment'
    },
    {
      id: 2,
      title: 'Schedule Visit',
      icon: '📅',
      description: 'Schedule customer visit for collection',
      action: '/schedule-visit'
    },
    {
      id: 3,
      title: 'Send Reminder',
      icon: '📱',
      description: 'Send payment reminder to customer',
      action: '/send-reminder'
    },
    {
      id: 4,
      title: 'Generate Report',
      icon: '📊',
      description: 'Generate collection report',
      action: '/generate-report'
    },
    {
      id: 5,
      title: 'Update Customer Info',
      icon: '👥',
      description: 'Update customer contact information',
      action: '/update-customer'
    },
    {
      id: 6,
      title: 'Request Support',
      icon: '🆘',
      description: 'Request management support',
      action: '/request-support'
    }
  ];

  const handleActionClick = (action) => {
    setActiveAction(action.id);
    // Simulate action processing
    setTimeout(() => {
      setActiveAction(null);
      alert(`Action: ${action.title} would be performed here`);
    }, 1000);
  };

  return (
    <div className="quick-actions-page">
      <div className="page-header">
        <h1>Quick Actions</h1>
        <p>Quick tools for daily collection activities</p>
      </div>

      <div className="actions-grid">
        {quickActions.map(action => (
          <div 
            key={action.id}
            className={`action-card ${activeAction === action.id ? 'active' : ''}`}
            onClick={() => handleActionClick(action)}
          >
            <div className="action-icon">{action.icon}</div>
            <div className="action-content">
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </div>
            {activeAction === action.id && (
              <div className="action-loading">Processing...</div>
            )}
          </div>
        ))}
      </div>

      <div className="recent-activities">
        <h2>Recent Activities</h2>
        <div className="activities-list">
          <div className="activity-item">
            <span className="activity-icon">💰</span>
            <div className="activity-details">
              <p>Payment recorded for Loan LN001</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">📱</span>
            <div className="activity-details">
              <p>Reminder sent to Priya Patel</p>
              <span className="activity-time">4 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;