import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Store token & user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isAuthenticated", true);

        // Role-based navigation
        switch (data.user.role) {
          case "master_admin":
            navigate("/admin/dashboard");
            break;
          case "collection_agent":
            navigate("/agent/dashboard");
            break;
          case "staff":
            navigate("/staff/dashboard");
            break;
          default:
            navigate("/dashboard");
            break;
        }
      } else {
        setErrorMsg(data.error || "Invalid email or password");
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg("Server error. Please try again later.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">VelanDev Portal</h2>
        <p className="login-subtitle">Sign in to your account</p>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
         <br/>
        <div className="signup">
          <p>Don't have an account? <a href="/signup">Sign Up</a></p>
        </div>
         
        <div className="login-footer">
          <p>© 2025 VelanDev | Secure Access Portal</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
