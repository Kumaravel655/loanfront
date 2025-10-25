// src/components/layout/Navbar/Navbar.jsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <header className={styles.navbar}>
      {/* Left: Search bar */}
      <div className={styles.searchContainer}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search loans, customers..."
          className={styles.searchInput}
        />
      </div>

      {/* Right: Notifications & Profile */}
      <div className={styles.userMenu}>
        <button className={styles.iconButton}>
          <span>🔔</span>
          <span className={styles.notificationBadge}>3</span>
        </button>

        <div
          className={styles.profile}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          ref={dropdownRef}
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="User Avatar"
            className={styles.avatar}
          />
          <div className={styles.profileInfo}>
            <span className={styles.userName}>
              {user ? user.username : "Loading..."}
            </span>
            <span className={styles.userRole}>
              {user ? user.role.replace("_", " ") : ""}
            </span>
          </div>

          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button onClick={handleProfile}>View Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
