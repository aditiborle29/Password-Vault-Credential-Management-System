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

  const checkStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";
    return "Strong";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCredential({
      ...credential,
      [name]: value,
    });

    if (name === "password") {
      setStrength(checkStrength(value));
    }
  };

  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}<>?";

    const all = upper + lower + numbers + symbols;
    const length = 16;

    let password = "";

    // Ensure all character types are included
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill remaining characters
    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setCredential({
      ...credential,
      password,
    });

    setStrength(checkStrength(password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addCredential(credential);
      alert("Credential Saved Successfully!");
      navigate("/vault");
    } catch (error) {
      alert("Failed to save credential");
    }
  };

  return (
    <div className="add-container">
      <div className="add-card">

        <h2>🔐 Add Credential</h2>
        <p>Store your website credentials securely</p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="website"
            placeholder="Website"
            value={credential.website}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username / Email"
            value={credential.username}
            onChange={handleChange}
            required
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={credential.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          <button
            type="button"
            className="generate-btn"
            onClick={generatePassword}
          >
            🎲 Generate Password
          </button>

          {strength && (
            <>
              <div className="strength-bar">
                <div className={strength.toLowerCase()}></div>
              </div>

              <p className={`strength-text ${strength.toLowerCase()}`}>
                Password Strength: <span>{strength}</span>
              </p>
            </>
          )}

          <button type="submit" className="save-btn">
            💾 Save Credential
          </button>

          <button
                type="button"
                className="back-btn"
                onClick={() => navigate("/login")}
            >
                ← Back
            </button>

        </form>
       
      </div>
      
    </div>
  );
}

export default AddCredential;