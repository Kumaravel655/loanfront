import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    if (!formData.role) {
      setErrorMsg("Please select a role!");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role.toLowerCase(), // Adjust if backend expects lowercase
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        alert("Signup successful!");
        console.log("Server response:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/login");
      } else {
        setErrorMsg(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg("An error occurred. Please check your connection.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Your Account</h2>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <FaUser className="icon" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <FaLock className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <FaLock className="icon" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
  <FaUserTag className="icon" />
  <select
    name="role"
    value={formData.role}
    onChange={handleChange}
    required
  >
    <option value="">Select Role</option>
    <option value="master_admin">Master Admin</option>
    <option value="collection_agent">Collection Agent</option>
    <option value="staff">Staff</option>
  </select>
</div>


          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="bottom-text">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
