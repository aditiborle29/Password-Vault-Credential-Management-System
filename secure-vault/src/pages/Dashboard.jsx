import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="dashboard-container">

            <div className="navbar">
                <h2>🔐 Secure Vault</h2>

                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div className="welcome">
                <h1>Welcome 👋</h1>
                <p>Manage your credentials securely from one place.</p>
            </div>

            <div className="card-container">

                <Link to="/add" className="card">
                    <div className="icon">➕</div>
                    <h3>Add Credential</h3>
                    <p>Save new website credentials securely.</p>
                </Link>

                <Link to="/vault" className="card">
                    <div className="icon">🔒</div>
                    <h3>View Credentials</h3>
                    <p>Access all your stored credentials.</p>
                </Link>

                <Link to="/forgot-password" className="card">
                    <div className="icon">🔑</div>
                    <h3>Forgot Password</h3>
                    <p>Update your account password.</p>
                </Link>

            </div>

        </div>
    );
}

export default Dashboard;