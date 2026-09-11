import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error and loading states
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {

    e.preventDefault();

    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Frontend validation
    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        "Password must contain at least 8 characters."
      );
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          name,
          email,
          password
        }
      );

      if (response.data === "User Registered Successfully") {

        setSuccessMessage(
          "Registration successful! Redirecting to login..."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1500);

      } else {

        setErrorMessage(
          response.data || "Registration failed."
        );
      }

    } catch (error) {

      console.error("Registration error:", error);

      if (error.response) {

        // Backend returned an error
        setErrorMessage(
          error.response.data ||
          "Registration failed. Please check your details."
        );

      } else if (error.request) {

        // Backend is not running
        setErrorMessage(
          "Unable to connect to server. Please make sure the backend is running."
        );

      } else {

        setErrorMessage(
          "Something went wrong. Please try again."
        );
      }

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="register-container">

      <div className="register-card">

        <h1>📝 Create Account</h1>

        <p className="subtitle">
          Register to access Secure Vault
        </p>

        {/* ERROR MESSAGE */}

        {errorMessage && (
          <div className="message error-message">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* SUCCESS MESSAGE */}

        {successMessage && (
          <div className="message success-message">
            ✅ {successMessage}
          </div>
        )}

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="login-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;