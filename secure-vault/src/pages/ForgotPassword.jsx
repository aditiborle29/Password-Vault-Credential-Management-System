import React, { useState } from "react";
import "./ForgotPassword.css";
import axios from "axios";
import { Link } from "react-router-dom";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.put(
        "http://localhost:8080/api/auth/forgot-password",
        {
          email,
          newPassword,
        }
      );

      alert(response.data);

    } catch (error) {
      alert("Failed to update password");
    }
  };

  return (
    <div className="forgot-container">

      <div className="forgot-card">

        <div className="lock-icon">🔒</div>

        <h2>Forgot Password</h2>

        <p className="subtitle">
          Reset your Secure Vault password
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button type="submit">
            Update Password
          </button>

        </form>

        <Link to="/login" className="back-link">
          ← Back to Login
        </Link>

      </div>

    </div>
  );
}

export default ForgotPassword;