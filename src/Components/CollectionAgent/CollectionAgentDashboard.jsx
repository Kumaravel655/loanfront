// import React, { useState } from 'react';
// import styles from './CollectionAgentDashboard.module.css';
// import { Link } from 'react-router-dom';

// const CollectionAgentDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
//    const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("isAuthenticated");
//     navigate("/");
//   };


//   return (
//     <div className={styles.dashboardContainer}>
//       {/* Sidebar */}
//       <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
//         <div className={styles.logo}>LMS Agent</div>
//         <ul className={styles.navList}>
//           <li><Link to="#" className={styles.navItem}>🏠 Dashboard</Link></li>
//           <li><Link to="#" className={styles.navItem}>📋 Assigned Loans</Link></li>
//           <li><Link to="#" className={styles.navItem}>💰 Today’s Collection</Link></li>
//           <li><Link to="#" className={styles.navItem}>📜 Collection History</Link></li>
//           <li><Link to="#" className={styles.navItem}>⏰ Pending/Overdue</Link></li>
//           <li><Link to="#" className={styles.navItem}>📈 Performance</Link></li>
//           <li><Link to="#" className={styles.navItem}>🔔 Notifications</Link></li>
//           <li><Link to="#" className={styles.navItem}>⚙️ Quick Actions</Link></li>
//           <li><Link to="/login" className={styles.navItem}>👤 Profile / Logout</Link></li>
//         </ul>
//       </aside>

//       {/* Main Content */}
//       <main className={styles.mainContent}>
//         <header className={styles.header}>
//           <button className={styles.menuBtn} onClick={toggleSidebar}>
//             ☰
//           </button>
//           <h1 className={styles.title}>Collection Agent Dashboard</h1>
//           <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
//         </header>

//         {/* Summary Section */}
//         <section className={styles.summaryGrid}>
//           <div className={styles.card}>
//             <h3>Total Collected Today</h3>
//             <p>₹12,450</p>
//           </div>
//           <div className={styles.card}>
//             <h3>Pending Dues</h3>
//             <p>₹4,300</p>
//           </div>
//           <div className={styles.card}>
//             <h3>Overdue Loans</h3>
//             <p>5 Accounts</p>
//           </div>
//         </section>

//         {/* Assigned Loans */}
//         <section className={styles.section}>
//           <h2>Assigned Loans / Due List</h2>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Customer</th>
//                 <th>Due Amount</th>
//                 <th>Due Date</th>
//                 <th>Status</th>
//                 <th>Mode</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>Ravi Kumar</td>
//                 <td>₹1,200</td>
//                 <td>24 Oct 2025</td>
//                 <td>Pending</td>
//                 <td>UPI</td>
//               </tr>
//               <tr>
//                 <td>Meena Devi</td>
//                 <td>₹850</td>
//                 <td>23 Oct 2025</td>
//                 <td>Collected</td>
//                 <td>Cash</td>
//               </tr>
//             </tbody>
//           </table>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default CollectionAgentDashboard;

import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Slidebar/Sidebar.jsx';
import styles from './CollectionAgentDashboard.module.css';

// Import all components...
import AgentDashboard from './AgentDashboard/AgentDashboard';
import AssignedLoans from './AssignedLoans/AssignedLoans';
import TodaySummary from './TodaySummary/TodaySummary';
import CollectionHistory from './CollectionHistory/CollectionHistory';
import PendingDues from './PendingDues/PendingDues';
import Performance from './Performance/Performance';
import Notifications from './Notifications/Notifications';
import QuickActions from './QuickActions/QuickActions';
import Profile from '../Profile/Profile';
import LoanDetail from '../../features/Loandetails/LoanDetails';
import CollectPage from './CollectPage/CollectPage';

const CollectionAgentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    initials: '',
    role: '',
    isLoading: true
  });

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token) {
          window.location.href = '/login';
          return;
        }

        // Option 1: If you have a dedicated user profile API endpoint
        try {
          const response = await fetch('/api/user/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userDataFromApi = await response.json();
            updateUserData(userDataFromApi);
            return;
          }
        } catch (apiError) {
          console.log('Profile API not available, using localStorage data');
        }
            const storedUser = localStorage.getItem("user");

        // Option 2: Fallback to localStorage data
        const user =  JSON.parse(storedUser);

        const userName = user.username;
        
        const userEmail = user.email;
        console.log(userName);
        const userRole = user.role;

        updateUserData({ name: userName, email: userEmail, role: userRole });

      } catch (error) {
        console.error('Error fetching user data:', error);
        // Set fallback data
        updateUserData({
          name: 'User Name',
          email: 'user@example.com',
          role: 'Collection Agent'
        });
      }
    };

    const updateUserData = (data) => {
      const initials = data.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      setUserData({
        name: data.name,
        email: data.email,
        initials: initials,
        role: data.role,
        isLoading: false
      });
    };

    fetchUserData();
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Call logout API if available
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.log('Logout API call failed, proceeding with client-side logout');
    } finally {
      // Clear all user-related data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      sessionStorage.clear();
      
      window.location.href = '/login';
    }
  };

  const notifications = [
    { id: 1, message: 'Payment due for Loan #LN001 tomorrow', time: '2 hours ago', read: false },
    { id: 2, message: 'New loan #LN045 assigned to you', time: '5 hours ago', read: true },
    { id: 3, message: 'Weekly collection target achieved', time: '1 day ago', read: true },
    { id: 4, message: 'Customer Rahul Sharma requested callback', time: '1 day ago', read: false },
  ];

  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Show loading state if data is still being fetched
  if (userData.isLoading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Dropdown Overlays - Placed outside main content */}
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
              <button className={styles.viewAllButton}>View All Notifications</button>
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
              </div>
            </div>
            
            <div className={styles.dropdownMenu}>
              <button 
                className={styles.menuItem}
                onClick={() => {
                  setShowProfileDropdown(false);
                  window.location.href = '/agent/profile';
                }}
              >
                <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>My Profile</span>
              </button>
              
              <button className={styles.menuItem}>
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
              <h1 className={styles.title}>Collection Agent Dashboard</h1>
            </div>
            
            <div className={styles.headerRight}>
              {/* Notifications Button */}
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

              {/* User Profile Button */}
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
            <Route path="/" element={<AgentDashboard />} />
            <Route path="/collect/:loanId" element={<CollectPage />} />

          </Routes>
        </div>
      </div>
    </div>
  );
};

export default CollectionAgentDashboard;