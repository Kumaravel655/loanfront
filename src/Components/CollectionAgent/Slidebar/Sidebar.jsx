import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaHome, FaClipboardList, FaHistory, FaExclamationTriangle, FaChartBar, FaUser, FaUsers, FaChartLine, FaUserTie, FaTimes } from 'react-icons/fa';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, setIsOpen, userType = 'agent' }) => {
  const agentItems = [
    { name: 'Dashboard', icon: FaHome, path: '/agent/dashboard' },
    { name: 'Assigned Loans', icon: FaClipboardList, path: '/agent/assigned-loans' },
    { name: 'Collection History', icon: FaHistory, path: '/agent/history' },
    { name: 'Pending Dues', icon: FaExclamationTriangle, path: '/agent/pending' },
    { name: 'Performance', icon: FaChartBar, path: '/agent/performance' },
    { name: 'Profile', icon: FaUser, path: '/agent/profile' },
  ];

  const staffItems = [
    { name: 'Dashboard', icon: FaHome, path: '/staff/dashboard' },
    { name: 'Agent Management', icon: FaUsers, path: '/staff/agents' },
    { name: 'Collection Reports', icon: FaChartBar, path: '/staff/reports' },
    { name: 'Performance Metrics', icon: FaChartLine, path: '/staff/performance' },
    { name: 'Team Overview', icon: FaUserTie, path: '/staff/team' },
    { name: 'Profile', icon: FaUser, path: '/staff/profile' },
  ];

  const navItems = userType === 'staff' ? staffItems : agentItems;

  return (
    <>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Link to={userType === 'staff' ? '/staff' : '/agent'} className={styles.logoLink}>
              {isOpen ? 'Loan Management System' : 'LMS'}
            </Link>
          </div>
          {isOpen && (
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          )}
        </div>

        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.name} className={styles.navItem}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
                onClick={() => {
                  // Close sidebar when navigation item is clicked
                  setIsOpen(false);
                }}
              >
                <span className={styles.icon}><item.icon /></span>
                {isOpen && <span className={styles.text}>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default Sidebar;