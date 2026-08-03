import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      alert(response.data);

      if (response.data === "User Registered Successfully") {
        navigate("/login");
      }

    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="register-container">

      <div className="register-card">

        <h1>📝 Create Account</h1>

        <p className="subtitle">
          Register to access Secure Vault
        </p>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Register
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