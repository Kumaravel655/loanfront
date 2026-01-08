import React, { useState, useEffect } from "react";
import { FaUser, FaEdit, FaSave, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { loanService } from "../../services/loanService";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : user.username || "User";
    
    setProfile({
      name: fullName,
      email: user.email || "",
      phone: user.phone_number || user.phone || "",
      role: user.role || "User",
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await loanService.updateProfile(profile);
      setEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser size={40} />
        </div>
        <h2>{profile.name}</h2>
        <p className="profile-role">{profile.role}</p>
      </div>

      <div className="profile-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            disabled={!editing}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={profile.email} disabled />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            disabled={!editing}
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input type="text" value={profile.role} disabled />
        </div>
      </div>

      <div className="profile-actions">
        {editing ? (
          <div className="edit-actions">
            <button className="btn-cancel" onClick={() => setEditing(false)}>
              <FaTimes /> Cancel
            </button>
            <button className="btn-save" onClick={handleSave} disabled={loading}>
              <FaSave /> {loading ? "Saving..." : "Save"}
            </button>
          </div>
        ) : (
          <button className="btn-edit" onClick={() => setEditing(true)}>
            <FaEdit /> Edit Profile
          </button>
        )}

        <button className="btn-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;