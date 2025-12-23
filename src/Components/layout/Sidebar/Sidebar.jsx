import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, onToggle }) => {
  const navItems = [
    { name: 'Dashboard', icon: '🏠', path: '/admin/dashboard' },
    { name: 'Loan Applications', icon: '📝', path: '/admin/loan-applications' },
    { name: 'Customers', icon: '👥', path: '/admin/customers' },
    { name: 'Loan Management', icon: '📊', path: '/admin/loans' },
    { name: 'Repayments', icon: '💰', path: '/admin/repayments' },
    { name: 'Disbursements', icon: '💸', path: '/admin/disbursements' },
    { name: 'Collection Agents', icon: '👨‍💼', path: '/admin/agents' },
    { name: 'Reports & Analytics', icon: '📈', path: '/admin/reports' },
    { name: 'Notifications', icon: '🔔', path: '/admin/notifications' },
    { name: 'Roles & Permissions', icon: '🔐', path: '/admin/roles' },
    { name: 'Profile', icon: '👤', path: '/admin/profile' },
  ];

  return (
    <>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Link to="/admin/dashboard" className={styles.logoLink}>LMS Admin</Link>
          </div>
          <button className={styles.closeBtn} onClick={onToggle}>
            ✕
          </button>
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
                  if (onToggle) {
                    onToggle();
                  }
                }}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.text}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      {isOpen && <div className={styles.overlay} onClick={onToggle}></div>}
    </>
  );
};

export default Sidebar;
