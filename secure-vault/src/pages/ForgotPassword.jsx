import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ================================
  // SEND OTP
  // ================================

  const sendOtp = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/send-otp?email=${encodeURIComponent(email)}`
      );

      setSuccess(response.data || "OTP sent successfully.");
      setOtpSent(true);

    } catch (error) {
      console.error("Send OTP Error:", error);

      if (error.response) {
        setError(
          error.response.data ||
          "Unable to send OTP. Please try again."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to server. Please make sure the backend is running."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };


  // ================================
  // RESET PASSWORD
  // ================================

  const resetPassword = async () => {
    setError("");
    setSuccess("");

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    if (!newPassword) {
      setError("Please enter your new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
       `${API_URL}/api/auth/verify-otp`,
        {
          email,
          otp,
          newPassword,
        }
      );

      setSuccess(
        response.data || "Password updated successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Reset Password Error:", error);

      if (error.response) {
        setError(
          error.response.data ||
          "Invalid or expired OTP."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to server. Please try again."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="forgot-container">

      <div className="forgot-card">

        <h2>🔐 Forgot Password</h2>

        <p className="forgot-subtitle">
          Reset your password using Email OTP
        </p>


        {/* ERROR MESSAGE */}

        {error && (
          <div className="forgot-error">
            ⚠️ {error}
          </div>
        )}


        {/* SUCCESS MESSAGE */}

        {success && (
          <div className="forgot-success">
            ✅ {success}
          </div>
        )}


        {/* EMAIL */}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          disabled={loading}
        />


        {/* SEND OTP */}

        <button
          onClick={sendOtp}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Send OTP"}
        </button>


        {/* OTP + NEW PASSWORD */}

        {otpSent && (
          <div className="reset-section">

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setError("");
              }}
              disabled={loading}
            />


            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError("");
              }}
              disabled={loading}
            />


            <button
              onClick={resetPassword}
              disabled={loading}
            >
              {loading
                ? "Updating Password..."
                : "Reset Password"}
            </button>

          </div>
        )}


        {/* BACK TO LOGIN */}

        <button
          className="back-login-btn"
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          ← Back to Login
        </button>

      </div>

    </div>
  );
}

export default ForgotPassword;