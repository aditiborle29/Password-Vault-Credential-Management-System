import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="logo">
        🔐 Secure Vault
      </div>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/add">Add Credential</Link>
        <Link to="/vault">Vault</Link>

        <button onClick={logout}>
          Logout
        </button>
      </div>

    </nav>
  );
}

export default Navbar;