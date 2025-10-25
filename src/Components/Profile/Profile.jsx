import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaUserTag, FaSignOutAlt } from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/"); // redirect to login if not logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>User Profile</h2>

        <div className="profile-item">
          <FaUser className="icon" />
          <span className="label">Username:</span>
          <span className="value">{user.username}</span>
        </div>

        <div className="profile-item">
          <FaEnvelope className="icon" />
          <span className="label">Email:</span>
          <span className="value">{user.email}</span>
        </div>

        <div className="profile-item">
          <FaUserTag className="icon" />
          <span className="label">Role:</span>
          <span className="value role">{user.role}</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
