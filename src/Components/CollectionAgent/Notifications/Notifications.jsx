import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/collection-agent/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Mock data
      setNotifications([
        {
          id: 1,
          title: 'Payment Due Reminder',
          message: 'Loan LN001 payment is due tomorrow',
          type: 'warning',
          timestamp: '2024-01-14T10:30:00',
          read: false
        },
        {
          id: 2,
          title: 'Collection Successful',
          message: 'Payment collected from Rahul Sharma - ₹15,000',
          type: 'success',
          timestamp: '2024-01-14T09:15:00',
          read: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN');
  };

  if (loading) {
    return <div className="loading">Loading notifications...</div>;
  }

  return (
    <div className="notifications">
      <div className="page-header">
        <h1>Notifications</h1>
        <div className="header-actions">
          <button className="mark-all-read">Mark All as Read</button>
        </div>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-data">No notifications</div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
            >
              <div className="notification-icon">
                {notification.type === 'warning' && '⚠️'}
                {notification.type === 'success' && '✅'}
                {notification.type === 'info' && 'ℹ️'}
                {notification.type === 'error' && '❌'}
              </div>
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <span className="timestamp">{formatTime(notification.timestamp)}</span>
              </div>
              {!notification.read && (
                <button 
                  className="mark-read-btn"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;