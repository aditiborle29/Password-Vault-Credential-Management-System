import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  // Send OTP
  const sendOtp = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/auth/send-otp?email=${email}`
      );

      alert(response.data);
      setOtpSent(true);

    } catch (error) {
      if (error.response) {
        alert(error.response.data);
      } else {
        alert("Unable to connect to server");
      }
    }
  };

  // Verify OTP & Reset Password
  const resetPassword = async () => {
    if (!otp || !newPassword) {
      alert("Please enter OTP and New Password");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/verify-otp",
        {
          email,
          otp,
          newPassword,
        }
      );

      alert(response.data);

      navigate("/login");

    } catch (error) {

      if (error.response) {
        alert(error.response.data);
      } else {
        alert("Failed to update password");
      }

    }
  };

  return (
    <div className="forgot-container">

      <div className="forgot-card">

        <h2>🔐 Forgot Password</h2>

        <p>Reset your password using Email OTP</p>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={sendOtp}>
          Send OTP
        </button>

        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button onClick={resetPassword}>
              Reset Password
            </button>
          </>
        )}

      </div>

    </div>
  );
}

export default ForgotPassword;