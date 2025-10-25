import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: '🏠', path: '/admin/dashboard' },
    { name: 'Loan Applications', icon: '📝', path: '/admin/loan-applications' },
    { name: 'Customers', icon: '👥', path: '/admin/customers' },
    { name: 'Repayments', icon: '💰', path: '/admin/repayments' },
    { name: 'Disbursements', icon: '💸', path: '/admin/disbursements' },
    { name: 'Roles & Permissions', icon: '🔐', path: '/admin/roles' },
    {name: 'Agents', icon: '👥', path: '/admin/Agents' },
    { name: 'Settings/Notifications', icon: '🔔', path: '/admin/settings' },
    {name: 'logout ', icon: '🚪', path: '/login' } ,
 
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        className={styles.toggleBtn}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✖️' : '☰'}
      </button>

      {/* Sidebar */}
      <nav className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink}>LMS</Link>
        </div>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.name} className={styles.navItem}>
              <NavLink
                to={item.path}
                onClick={() => setIsOpen(false)} // close sidebar after click
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.text}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
