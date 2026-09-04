import React, { useState } from "react";
import { addCredential } from "../services/credentialService";
import { useNavigate } from "react-router-dom";
import "./AddCredential.css";

function AddCredential() {
  const navigate = useNavigate();

  const [credential, setCredential] = useState({
    website: "",
    username: "",
    password: "",
  });

  const [strength, setStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Error, success and loading states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= PASSWORD STRENGTH =================

  const checkStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (password.length === 0) return "";

    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";

    return "Strong";
  };

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCredential((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");

    if (name === "password") {
      setStrength(checkStrength(value));
    }
  };

  // ================= PASSWORD GENERATOR =================

  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}<>?";

    const all = upper + lower + numbers + symbols;

    const length = 16;

    let password = "";

    // Make sure generated password contains all required types
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle password
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setCredential((prev) => ({
      ...prev,
      password: password,
    }));

    setStrength(checkStrength(password));
    setError("");
    setSuccess("");
  };

  // ================= FORM VALIDATION =================

  const validateForm = () => {
    if (!credential.website.trim()) {
      return "Please enter a website.";
    }

    if (!credential.username.trim()) {
      return "Please enter a username or email.";
    }

    if (!credential.password.trim()) {
      return "Please enter a password.";
    }

    if (credential.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (strength === "Weak") {
      return "Please use a stronger password.";
    }

    return "";
  };

  // ================= SAVE CREDENTIAL =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await addCredential(credential);

      setSuccess("Credential saved successfully!");

      // Redirect after success
      setTimeout(() => {
        navigate("/vault");
      }, 800);
    } catch (error) {
      console.error("Add credential error:", error);

      if (error.response) {
        const status = error.response.status;

        if (status === 401) {
          setError("Your session has expired. Please login again.");
        } else if (status === 403) {
          setError(
            "You are not authorized to save this credential."
          );
        } else if (status === 400) {
          setError(
            error.response.data?.message ||
              "Invalid credential information."
          );
        } else if (status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(
            error.response.data?.message ||
              "Unable to save credential. Please try again."
          );
        }
      } else if (error.request) {
        setError(
          "Unable to connect to the server. Please check your connection."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-container">
      <div className="add-card">

        {/* Heading */}
        <h2>🔐 Add Credential</h2>

        <p className="subtitle">
          Store your website credentials securely
        </p>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="success-message">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* WEBSITE */}
          <div className="input-group">
            <label>Website</label>

            <input
              type="text"
              name="website"
              placeholder="e.g. www.google.com"
              value={credential.website}
              onChange={handleChange}
              required
            />
          </div>

          {/* USERNAME */}
          <div className="input-group">
            <label>Username / Email</label>

            <input
              type="text"
              name="username"
              placeholder="Enter username or email"
              value={credential.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>

            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={credential.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* GENERATE PASSWORD */}
          <button
            type="button"
            className="generate-btn"
            onClick={generatePassword}
          >
            🎲 Generate Strong Password
          </button>

          {/* PASSWORD STRENGTH */}
          {strength && (
            <div className="password-strength">

              <div className="strength-bar">
                <div
                  className={`strength-fill ${strength.toLowerCase()}`}
                ></div>
              </div>

              <p
                className={`strength-text ${strength.toLowerCase()}`}
              >
                Password Strength:{" "}
                <strong>{strength}</strong>
              </p>

            </div>
          )}

          {/* SAVE BUTTON */}
          <button
            type="submit"
            className="save-btn"
            disabled={loading}
          >
            {loading ? "⏳ Saving..." : "💾 Save Credential"}
          </button>

          {/* BACK BUTTON */}
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/dashboard")}
            disabled={loading}
          >
            ← Back to Dashboard
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddCredential;