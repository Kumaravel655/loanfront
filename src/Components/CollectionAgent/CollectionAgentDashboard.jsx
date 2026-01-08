import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Slidebar/Sidebar.jsx';
import Navbar from '../layout/Navbar/Navbar';
import { loanService } from '../../services/loanService';
import ProfileDropdown from '../shared/ProfileDropdown/ProfileDropdown';
import styles from './CollectionAgentDashboard.module.css';

import AgentDashboard from './AgentDashboard/AgentDashboard';
import AssignedLoans from './AssignedLoans/AssignedLoans';
import TodaySummary from './TodaySummary/TodaySummary';
import CollectionHistory from './CollectionHistory/CollectionHistory';
import PendingDues from './PendingDues/PendingDues';
import Performance from './Performance/Performance';
import Notifications from './Notifications/Notifications';
import QuickActions from './QuickActions/QuickActions';
import Profile from '../Profile/Profile';
import Settings from '../Settings/Settings';
import LoanDetail from '../../features/Loandetails/LoanDetails';
import CollectPage from './CollectPage/CollectPage';

const CollectionAgentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Agent',
    email: 'agent@lms.com',
    initials: 'AG',
    role: 'collection_agent'
  });
  const [notifications, setNotifications] = useState([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const initials = (user.username || 'A').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      setUserData({
        name: user.username || 'Agent',
        email: user.email || 'agent@lms.com',
        initials: initials,
        role: user.role || 'collection_agent'
      });
    }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await loanService.getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

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
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const unreadCount = notifications.filter(notification => !notification.is_read).length;

  return (
    <div className={styles.dashboard}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            className={styles.dropdownOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className={styles.notificationDropdown} 
              ref={notificationRef}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className={styles.notificationHeader}>
                <div className={styles.notificationHeaderContent}>
                  <div className={styles.notificationIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <div>
                    <h3>Notifications</h3>
                    <span className={styles.notificationSubtitle}>{unreadCount} unread messages</span>
                  </div>
                </div>
              </div>
              <div className={styles.notificationList}>
                {notifications.length > 0 ? notifications.map((notification, index) => (
                  <motion.div 
                    key={notification.id} 
                    className={`${styles.notificationItem} ${!notification.is_read ? styles.unread : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={styles.notificationIcon}>
                      {!notification.is_read && <div className={styles.notificationDot}></div>}
                      <div className={styles.notificationTypeIcon}>
                        {notification.type === 'payment' && '💰'}
                        {notification.type === 'overdue' && '⚠️'}
                        {notification.type === 'reminder' && '🔔'}
                        {!notification.type && '📢'}
                      </div>
                    </div>
                    <div className={styles.notificationContent}>
                      <p className={styles.notificationText}>{notification.title || notification.message}</p>
                      <span className={styles.notificationTime}>
                        {new Date(notification.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </motion.div>
                )) : (
                  <div className={styles.noNotifications}>
                    <div className={styles.emptyStateIcon}>🔔</div>
                    <p>No notifications yet</p>
                    <span>You're all caught up!</span>
                  </div>
                )}
              </div>
              <div className={styles.notificationFooter}>
                <button className={styles.viewAllButton} onClick={() => setShowNotifications(false)}>
                  <span>View All Notifications</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfileDropdown && (
          <motion.div 
            className={styles.dropdownOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ProfileDropdown 
              userData={userData}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
              profileRef={profileRef}
              dashboardType="agent"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={`${styles.mainContent} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <Navbar onToggleSidebar={toggleSidebar} />

        <motion.div 
          className={styles.contentArea}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Routes>
            <Route path="/dashboard" element={<AgentDashboard />} />
            <Route path="/assigned-loans" element={<AssignedLoans />} />
            <Route path="/summary" element={<TodaySummary />} />
            <Route path="/history" element={<CollectionHistory />} />
            <Route path="/pending" element={<PendingDues />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/actions" element={<QuickActions />} />
            <Route path="/loan/:id" element={<LoanDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<AgentDashboard />} />
            <Route path="/collect/:loanId" element={<CollectPage />} />
          </Routes>
        </motion.div>
      </div>
    </div>
  );
};

export default CollectionAgentDashboard;