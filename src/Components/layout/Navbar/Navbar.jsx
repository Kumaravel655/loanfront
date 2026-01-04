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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </span>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
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
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                View Profile
              </button>
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
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-3.5L19 4m-7 7l-2.5 2.5M7.5 4.5L5 7"></path>
                </svg>
                Settings
              </button>
              <div className={styles.divider}></div>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
