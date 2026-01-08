import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ProfileDropdown.css';

const ProfileDropdown = ({ 
  userData, 
  showProfileDropdown, 
  setShowProfileDropdown, 
  profileRef,
  dashboardType = 'agent'
}) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'collection_agent': return 'Collection Agent';
      case 'staff': return 'Staff Member';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  const getProfilePath = () => {
    switch (dashboardType) {
      case 'agent': return '/agent/profile';
      case 'staff': return '/staff/profile';
      case 'admin': return '/admin/profile';
      default: return '/profile';
    }
  };

  const getSettingsPath = () => {
    switch (dashboardType) {
      case 'agent': return '/agent/settings';
      case 'staff': return '/staff/settings';
      case 'admin': return '/admin/settings';
      default: return '/settings';
    }
  };

  return (
    <motion.div 
      className="profile-dropdown" 
      ref={profileRef}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="profile-header">
        <div className="profile-avatar-large">
          <span>{userData.initials}</span>
          <div className="online-indicator"></div>
        </div>
        <div className="profile-info-large">
          <span className="profile-name-large">{userData.name}</span>
          <span className="profile-email">{userData.email}</span>
          <span className="profile-role">{getRoleDisplayName(userData.role)}</span>
        </div>
      </div>
      
      <div className="dropdown-menu">
        <Link 
          to={getProfilePath()} 
          className="menu-item"
          onClick={() => setShowProfileDropdown(false)}
        >
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>My Profile</span>
        </Link>
        
        <Link 
          to={getSettingsPath()} 
          className="menu-item"
          onClick={() => setShowProfileDropdown(false)}
        >
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Settings</span>
        </Link>
        
        <div className="menu-divider"></div>
        
        <button className="menu-item logout-item" onClick={handleLogout}>
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileDropdown;