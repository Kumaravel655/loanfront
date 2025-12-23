import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from "../CollectionAgent/Slidebar/Sidebar";
import styles from './StaffDashboard.module.css';

import StaffOverview from './StaffOverview/StaffOverview';
import AgentManagement from './AgentManagement/AgentManagement';
import CollectionReports from './CollectionReports/CollectionReports';
import PerformanceMetrics from './PerformanceMetrics/PerformanceMetrics';
import TeamOverview from './TeamOverview/TeamOverview'; 
import Attendance from './Attendance/Attendance'; 
import TargetSetting from './TargetSetting/TargetSetting'; 
import StaffProfile from '../Profile/Profile';
import Settings from '../Settings/Settings';
import Notifications from '../CollectionAgent/Notifications/Notifications';

const StaffDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    initials: '',
    role: '',
    department: ''
  });

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'))

  // Load staff data from localStorage
  useEffect(() => {
    const loadStaffData = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userName = user.username || 'Staff Manager';
        const userEmail = user.email || 'staff@lms.com';
        const userRole = user.role || 'Staff Manager';
        const department = localStorage.getItem('department') || 'Operations';

        // Generate initials from username
        const initials = userName
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        setUserData({
          name: userName,
          email: userEmail,
          initials: initials,
          role: userRole,
          department: department
        });
      } catch (error) {
        console.error('Error loading staff data:', error);
        setUserData({
          name: 'Staff Manager',
          email: 'staff@lms.com',
          initials: 'SM',
          role: 'Staff Manager',
          department: 'Operations'
        });
      }
    };

    loadStaffData();
    
    // Listen for storage changes
    window.addEventListener('storage', loadStaffData);
    
    return () => {
      window.removeEventListener('storage', loadStaffData);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('department');
    window.location.href = '/login';
  };

  const notifications = [
    { id: 1, message: 'Agent Ravi Kumar exceeded collection target', time: '1 hour ago', read: false },
    { id: 2, message: '3 overdue accounts need attention', time: '3 hours ago', read: true },
    { id: 3, message: 'Monthly performance report ready', time: '5 hours ago', read: true },
    { id: 4, message: 'New agent onboarding required', time: '1 day ago', read: false },
  ];

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className={styles.dashboard}>
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        userType="staff" 
      />
      
      {/* Dropdown Overlays */}
      {showNotifications && (
        <div className={styles.dropdownOverlay}>
          <div className={styles.notificationDropdown} ref={notificationRef}>
            <div className={styles.notificationHeader}>
              <h3>Notifications</h3>
              <span className={styles.notificationSubtitle}>{unreadCount} unread</span>
            </div>
            
            <div className={styles.notificationList}>
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                >
                  <div className={styles.notificationDot}></div>
                  <div className={styles.notificationContent}>
                    <p className={styles.notificationText}>{notification.message}</p>
                    <span className={styles.notificationTime}>{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.notificationFooter}>
              <button 
                className={styles.viewAllButton}
                onClick={() => {
                  setShowNotifications(false);
                  window.location.href = '/staff/notifications';
                }}
              >
                View All Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileDropdown && (
        <div className={styles.dropdownOverlay}>
          <div className={styles.profileDropdown} ref={profileRef}>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatarLarge}>
                {userData.initials}
              </div>
              <div className={styles.profileInfoLarge}>
                <span className={styles.profileNameLarge}>{userData.name}</span>
                <span className={styles.profileEmail}>{userData.email}</span>
                <span className={styles.profileDepartment}>{userData.department}</span>
              </div>
            </div>
            
            <div className={styles.dropdownMenu}>
              <button 
                className={styles.menuItem}
                onClick={() => {
                  setShowProfileDropdown(false);
                  window.location.href = '/staff/profile';
                }}
              >
                <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>My Profile</span>
              </button>
              
              <button 
                className={styles.menuItem}
                onClick={() => {
                  setShowProfileDropdown(false);
                  window.location.href = '/staff/settings';
                }}
              >
                <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Settings</span>
              </button>
              
              <div className={styles.menuDivider}></div>
              
              <button 
                className={`${styles.menuItem} ${styles.logoutItem}`}
                onClick={handleLogout}
              >
                <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={`${styles.mainContent} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              {!sidebarOpen && (
                <button 
                  className={styles.menuToggle}
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open menu"
                >
                  <svg className={styles.hamburgerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
              
              {/* Search Bar */}
              <div className={styles.searchContainer}>
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search loans, customers..."
                  className={styles.searchInput}
                />
              </div>
            </div>
            
            <div className={styles.headerRight}>
              {/* Notifications */}
              <div className={styles.notificationContainer}>
                <button 
                  className={styles.notificationButton}
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileDropdown(false);
                  }}
                  aria-label="Notifications"
                >
                  <div className={styles.bellContainer}>
                    <svg className={styles.bellIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className={styles.notificationCounter}>{unreadCount}</span>
                    )}
                  </div>
                </button>
              </div>

              {/* User Profile */}
              <div className={styles.profileContainer}>
                <button 
                  className={styles.profileButton}
                  onClick={() => {
                    setShowProfileDropdown(!showProfileDropdown);
                    setShowNotifications(false);
                  }}
                  aria-label="User profile"
                >
                  <div className={styles.profileInfo}>
                    <div className={styles.profileAvatar}>
                      {userData.initials}
                    </div>
                    <div className={styles.profileDetails}>
                      <span className={styles.profileName}>{userData.name}</span>
                      <span className={styles.profileRole}>{userData.role}</span>
                    </div>
                  </div>
                  <svg className={`${styles.chevronIcon} ${showProfileDropdown ? styles.rotated : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.contentArea}>
          <Routes>
            <Route path="/dashboard" element={<StaffOverview />} />
            <Route path="/agents" element={<AgentManagement />} />
            <Route path="/reports" element={<CollectionReports />} />
            <Route path="/performance" element={<PerformanceMetrics />} />
            <Route path="/team" element={<TeamOverview />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/targets" element={<TargetSetting />} />
            <Route path="/profile" element={<StaffProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/" element={<StaffOverview />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;