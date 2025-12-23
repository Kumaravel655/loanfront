import React, { useState, useEffect } from 'react';
import { loanService } from '../../../services/loanService';
import { FaBell, FaExclamationTriangle } from 'react-icons/fa';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await loanService.getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await loanService.markNotificationRead(id);
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, is_read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
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
        <h1><FaBell /> Notifications</h1>
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
              className={`notification-item ${notification.is_read ? 'read' : 'unread'} ${notification.type}`}
            >
              <div className="notification-icon">
                {notification.type === 'warning' && <FaExclamationTriangle />}
                {notification.type === 'success' && '✅'}
                {notification.type === 'info' && <FaBell />}
                {notification.type === 'error' && '❌'}
              </div>
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <span className="timestamp">{formatTime(notification.created_at)}</span>
              </div>
              {!notification.is_read && (
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