import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loanService } from '../../../services/loanService';
import styles from "./Navbar.module.css";

const Navbar = ({ onToggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    
    loadUser();
    fetchNotifications();
    
    // Listen for storage changes
    window.addEventListener('storage', loadUser);
    
    return () => {
      window.removeEventListener('storage', loadUser);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await loanService.getNotifications();
      setNotifications(data.slice(0, 5)); // Show only 5 recent
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:8000/api/auth/logout/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log('Logout API failed');
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className={styles.navbar}>
      <div className={styles.leftSection}>
        <button className={styles.menuToggle} onClick={onToggleSidebar}>
          ☰
        </button>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search loans, customers..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.notificationContainer} ref={notificationRef}>
          <button 
            className={styles.iconButton}
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setDropdownOpen(false);
            }}
          >
            <span>🔔</span>
            {unreadCount > 0 && (
              <span className={styles.notificationBadge}>{unreadCount}</span>
            )}
          </button>
          
          {notificationOpen && (
            <div className={styles.notificationDropdown}>
              <div className={styles.notificationHeader}>
                <h4>Notifications</h4>
                <span>{unreadCount} unread</span>
              </div>
              <div className={styles.notificationList}>
                {notifications.length > 0 ? notifications.map(notification => (
                  <div key={notification.notification_id} className={`${styles.notificationItem} ${!notification.is_read ? styles.unread : ''}`}>
                    <div className={styles.notificationContent}>
                      <h5>{notification.title}</h5>
                      <p>{notification.message}</p>
                      <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                )) : (
                  <div className={styles.noNotifications}>
                    <p>No notifications</p>
                  </div>
                )}
              </div>
              <div className={styles.notificationFooter}>
                <button 
                  className={styles.viewAllBtn}
                  onClick={() => {
                    const userRole = user?.role;
                    if (userRole === 'master_admin') {
                      navigate('/admin/notifications');
                    } else if (userRole === 'collection_agent') {
                      navigate('/agent/notifications');
                    } else if (userRole === 'staff') {
                      navigate('/staff/notifications');
                    } else {
                      navigate('/notifications');
                    }
                    setNotificationOpen(false);
                  }}
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.profile} onClick={() => {
          setDropdownOpen(!dropdownOpen);
          setNotificationOpen(false);
        }} ref={dropdownRef}>
          <div className={styles.avatar}>
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.userName}>
              {user?.username || "Admin"}
            </span>
            <span className={styles.userRole}>
              {user?.role?.replace("_", " ") || "Administrator"}
            </span>
          </div>
          <span className={styles.chevron}>▼</span>

          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button onClick={() => {
                const userRole = user?.role;
                if (userRole === 'master_admin') {
                  navigate('/admin/profile');
                } else if (userRole === 'collection_agent') {
                  navigate('/agent/profile');
                } else if (userRole === 'staff') {
                  navigate('/staff/profile');
                } else {
                  navigate('/profile');
                }
              }}>👤 View Profile</button>
              <button onClick={() => {
                const userRole = user?.role;
                if (userRole === 'master_admin') {
                  navigate('/admin/settings');
                } else if (userRole === 'collection_agent') {
                  navigate('/agent/settings');
                } else if (userRole === 'staff') {
                  navigate('/staff/settings');
                } else {
                  navigate('/settings');
                }
              }}>⚙️ Settings</button>
              <div className={styles.divider}></div>
              <button onClick={handleLogout} className={styles.logoutBtn}>🚪 Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
