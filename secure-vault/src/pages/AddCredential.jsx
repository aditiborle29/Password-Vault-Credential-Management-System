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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  // =====================================================
  // PASSWORD STRENGTH
  // SAME RULES USED BY REPORT
  // =====================================================

  const checkStrength = (password) => {

    if (!password || password.length === 0) {
      return "";
    }

    let score = 0;

    // 1. Length
    if (password.length >= 8) {
      score++;
    }

    // 2. Uppercase
    if (/[A-Z]/.test(password)) {
      score++;
    }

    // 3. Lowercase
    if (/[a-z]/.test(password)) {
      score++;
    }

    // 4. Number
    if (/[0-9]/.test(password)) {
      score++;
    }

    // 5. Special character
    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    }

    // SAME RULES AS BACKEND

    if (score <= 2) {
      return "Weak";
    }

    if (score <= 4) {
      return "Medium";
    }

    return "Strong";
  };


  // =====================================================
  // HANDLE INPUT
  // =====================================================

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


  // =====================================================
  // PASSWORD GENERATOR
  // =====================================================

  const generatePassword = () => {

    const upper =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const lower =
      "abcdefghijklmnopqrstuvwxyz";

    const numbers =
      "0123456789";

    const symbols =
      "!@#$%^&*()_+-=[]{}<>?";

    const all =
      upper + lower + numbers + symbols;


    const getRandomCharacter = (characters) => {

      return characters[
        Math.floor(
          Math.random() * characters.length
        )
      ];
    };


    let password =
      getRandomCharacter(upper) +
      getRandomCharacter(lower) +
      getRandomCharacter(numbers) +
      getRandomCharacter(symbols);


    while (password.length < 16) {

      password +=
        getRandomCharacter(all);
    }


    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");


    setCredential((prev) => ({
      ...prev,
      password,
    }));

    setStrength(
      checkStrength(password)
    );

    setError("");
    setSuccess("");
  };


  // =====================================================
  // FORM VALIDATION
  // =====================================================

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


    // Minimum length required for storing password
    if (credential.password.length < 8) {

      return "Password must contain at least 8 characters.";
    }


    // IMPORTANT:
    // Weak password is NOT blocked.
    // It can be stored and detected in Reports.

    return "";
  };


  // =====================================================
  // SAVE CREDENTIAL
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setSuccess("");


    const validationError =
      validateForm();


    if (validationError) {

      setError(validationError);

      return;
    }


    setLoading(true);


    try {

      await addCredential(
        credential
      );


      setSuccess(
        "Credential saved successfully!"
      );


      setTimeout(() => {

        navigate("/vault");

      }, 800);


    } catch (error) {

      console.error(
        "Add credential error:",
        error
      );


      if (error.response) {

        const status =
          error.response.status;


        if (status === 401) {

          setError(
            "Your session has expired. Please login again."
          );

        } else if (status === 403) {

          setError(
            "You are not authorized to save this credential."
          );

        } else if (status === 400) {

          setError(
            error.response.data?.message ||
            "Invalid credential information."
          );

        } else if (status === 404) {

          setError(
            "Credential service was not found."
          );

        } else if (status >= 500) {

          setError(
            "Server error. Please try again later."
          );

        } else {

          setError(
            error.response.data?.message ||
            "Unable to save credential."
          );
        }


      } else if (error.request) {

        setError(
          "Unable to connect to the server. Please check that the backend is running."
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


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="add-container">

      <div className="add-card">

        <h2>
          🔐 Add Credential
        </h2>


        <p className="subtitle">
          Store your website credentials securely
        </p>


        {error && (
          <div
            className="error-message"
            role="alert"
          >
            ⚠️ {error}
          </div>
        )}


        {success && (
          <div
            className="success-message"
            role="status"
          >
            ✅ {success}
          </div>
        )}


        <form onSubmit={handleSubmit}>


          {/* WEBSITE */}

          <div className="input-group">

            <label htmlFor="website">
              Website
            </label>

            <input
              id="website"
              type="text"
              name="website"
              placeholder="e.g. www.google.com"
              value={credential.website}
              onChange={handleChange}
              autoComplete="url"
              disabled={loading}
            />

          </div>


          {/* USERNAME */}

          <div className="input-group">

            <label htmlFor="username">
              Username / Email
            </label>

            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter username or email"
              value={credential.username}
              onChange={handleChange}
              autoComplete="username"
              disabled={loading}
            />

          </div>


          {/* PASSWORD */}

          <div className="input-group">

            <label htmlFor="password">
              Password
            </label>


          <div className="password-container">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    disabled={loading}
  />

  <button
    type="button"
    className="eye-btn"
    onClick={() => setShowPassword(!showPassword)}
    disabled={loading}
  >
    {showPassword ? "🙈" : "👁️"}
  </button>
</div>
</div>

          {/* GENERATE PASSWORD */}

          <button
            type="button"
            className="generate-btn"
            onClick={generatePassword}
            disabled={loading}
          >
            🎲 Generate Strong Password
          </button>


          {/* PASSWORD STRENGTH */}

          {strength && (

            <div className="password-strength">

              <div className="strength-bar">

                <div
                  className={`strength-fill ${strength.toLowerCase()}`}
                >
                </div>

              </div>


              <p
                className={`strength-text ${strength.toLowerCase()}`}
              >
                Password Strength:{" "}
                <strong>
                  {strength}
                </strong>
              </p>


              {strength === "Weak" && (

                <p className="strength-warning">
                  ⚠️ This password is weak.
                  You can still save it,
                  but consider using a stronger password.
                </p>

              )}

            </div>
          )}


          {/* SAVE */}

          <button
            type="submit"
            className="save-btn"
            disabled={loading}
          >
            {loading
              ? "⏳ Saving..."
              : "💾 Save Credential"}
          </button>


          {/* BACK */}

          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/dashboard")
            }
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