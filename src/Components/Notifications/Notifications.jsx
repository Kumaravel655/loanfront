import React, { useState, useEffect } from 'react';
import { loanService } from '../../services/loanService';
import { FaBell, FaDollarSign, FaExclamationTriangle, FaClock, FaInbox } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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
      await loanService.markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.is_read;
    if (filter === 'read') return notif.is_read;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'payment': return <FaDollarSign />;
      case 'overdue': return <FaExclamationTriangle />;
      case 'system': return <FaBell />;
      case 'reminder': return <FaClock />;
      default: return <FaBell />;
    }
  };

  if (loading) {
    return <div style={{padding: '20px', textAlign: 'center'}}>Loading notifications...</div>;
  }

  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
      <div style={{marginBottom: '30px'}}>
        <h1 style={{fontSize: '28px', marginBottom: '8px'}}><FaBell /> Notifications</h1>
        <p style={{color: '#666', margin: 0}}>Stay updated with system alerts and important messages</p>
      </div>

      <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
        <button 
          style={{
            padding: '8px 16px',
            border: filter === 'all' ? '2px solid #007bff' : '1px solid #ddd',
            borderRadius: '6px',
            background: filter === 'all' ? '#007bff' : 'white',
            color: filter === 'all' ? 'white' : '#333',
            cursor: 'pointer'
          }}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button 
          style={{
            padding: '8px 16px',
            border: filter === 'unread' ? '2px solid #007bff' : '1px solid #ddd',
            borderRadius: '6px',
            background: filter === 'unread' ? '#007bff' : 'white',
            color: filter === 'unread' ? 'white' : '#333',
            cursor: 'pointer'
          }}
          onClick={() => setFilter('unread')}
        >
          Unread ({notifications.filter(n => !n.is_read).length})
        </button>
        <button 
          style={{
            padding: '8px 16px',
            border: filter === 'read' ? '2px solid #007bff' : '1px solid #ddd',
            borderRadius: '6px',
            background: filter === 'read' ? '#007bff' : 'white',
            color: filter === 'read' ? 'white' : '#333',
            cursor: 'pointer'
          }}
          onClick={() => setFilter('read')}
        >
          Read ({notifications.filter(n => n.is_read).length})
        </button>
      </div>

      <div>
        {filteredNotifications.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}><FaInbox /></div>
            <h3>No notifications found</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                border: '1px solid #eee',
                borderRadius: '8px',
                marginBottom: '12px',
                backgroundColor: !notification.is_read ? '#f8f9ff' : 'white',
                cursor: !notification.is_read ? 'pointer' : 'default',
                position: 'relative'
              }}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
            >
              <div style={{fontSize: '24px', marginTop: '4px'}}>
                {getNotificationIcon(notification.type)}
              </div>
              <div style={{flex: 1}}>
                <h4 style={{margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600'}}>
                  {notification.title}
                </h4>
                <p style={{margin: '0 0 8px 0', color: '#555', lineHeight: '1.4'}}>
                  {notification.message}
                </p>
                <span style={{fontSize: '12px', color: '#888'}}>
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
              {!notification.is_read && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#007bff',
                  position: 'absolute',
                  top: '16px',
                  right: '16px'
                }}></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;