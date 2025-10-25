import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar open by default

  const navItems = [
    { name: 'Dashboard', icon: '🏠', path: '/agent/dashboard' },
    { name: 'Assigned Loans', icon: '📝', path: '/agent/assigned-loans' },
    { name: 'Today’s Summary', icon: '📅', path: '/agent/summary' },
    { name: 'Collection History', icon: '📘', path: '/agent/history' },
    { name: 'Pending Dues', icon: '⚠️', path: '/agent/pending' },
    { name: 'Performance', icon: '📊', path: '/agent/performance' },
    { name: 'Notifications', icon: '🔔', path: '/agent/notifications' },
    { name: 'Quick Actions', icon: '⚡', path: '/agent/actions' },
    { name: 'Profile / Logout', icon: '👤', path: '/agent/profile' },
  ];

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      {/* Toggle Button */}
      <button
        className={styles.toggleBtn}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '❮' : '❯'}
      </button>

      <div className={styles.logo}>
        <Link to="/" className={styles.logoLink}>LMS</Link>
      </div>

      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.name} className={styles.navItem}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <span className={styles.icon}>{item.icon}</span>
              {isOpen && <span className={styles.text}>{item.name}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
