import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    // ==============================
    // FRONTEND VALIDATION
    // ==============================

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    // Check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: email.trim(),
          password: password
        }
      );

      // ==============================
      // SUCCESS
      // ==============================

      if (response.data === "Login Successful") {

        localStorage.setItem("userEmail", email.trim());

        navigate("/dashboard");

      } else {

        setError(
          response.data || "Invalid email or password."
        );

      }

    } catch (error) {

      console.error("Login Error:", error);

      // ==============================
      // BACKEND ERROR
      // ==============================

      if (error.response) {

        setError(
          typeof error.response.data === "string"
            ? error.response.data
            : "Invalid email or password."
        );

      }

      // ==============================
      // SERVER NOT RUNNING
      // ==============================

      else if (error.request) {

        setError(
          "Unable to connect to server. Please make sure the backend is running."
        );

      }

      // ==============================
      // OTHER ERROR
      // ==============================

      else {

        setError(
          "Something went wrong. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="login-container">

      <div className="login-card">

        <h1>🔐 Secure Vault</h1>

        <p className="subtitle">
          Store and manage your credentials securely
        </p>


        {/* ERROR MESSAGE */}

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}


        {/* LOGIN FORM */}

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />


          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />


          <button
            type="submit"
            disabled={loading}
          >

            {loading ? "Logging in..." : "Login"}

          </button>

        </form>


        <Link
          className="forgot-link"
          to="/forgot-password"
        >
          Forgot Password?
        </Link>


        <p className="register-text">

          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;