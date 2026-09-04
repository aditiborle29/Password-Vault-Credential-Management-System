import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("userEmail");
        navigate("/login");
    };

    return (
        <div className="dashboard-container">

            {/* NAVBAR */}

            <div className="navbar">

    <h2>🔐 Secure Vault</h2>

    <div className="nav-links">

        <Link
            to="/security"
            className="security-link"
        >
            🛡️ Security
        </Link>

        <button
            className="logout-btn"
            onClick={handleLogout}
        >
            Logout
        </button>

    </div>

</div>

            {/* WELCOME */}

            <div className="welcome">

                <h1>Welcome 👋</h1>

                <p>
                    Manage your credentials securely in one place.
                </p>

            </div>


            {/* CARDS */}

            <div className="card-container">

                {/* ADD CREDENTIAL */}

                <Link
                    to="/add"
                    className="card"
                >

                    <div className="icon">
                        ➕
                    </div>

                    <h3>
                        Add Credential
                    </h3>

                    <p>
                        Save new website credentials securely.
                    </p>

                </Link>


                {/* VIEW CREDENTIALS */}

                <Link
                    to="/vault"
                    className="card"
                >

                    <div className="icon">
                        🔒
                    </div>

                    <h3>
                        View Credentials
                    </h3>

                    <p>
                        Access all your stored credentials.
                    </p>

                </Link>


                {/* SHARED WITH ME */}

                <Link
                    to="/shared"
                    className="card"
                >

                    <div className="icon">
                        🔗
                    </div>

                    <h3>
                        Shared
                    </h3>

                    <p>
                        View credentials shared with you.
                    </p>

                </Link>

                <Link
    to="/reports"
    className="card"
>

    <div className="icon">
        📊
    </div>

    <h3>
        Security Reports
    </h3>

    <p>
        View password health and login
        activity reports.
    </p>

</Link>
                {/* FORGOT PASSWORD */}

                {/* 
                <Link
                    to="/forgot-password"
                    className="card"
                >

                    <div className="icon">
                        🔑
                    </div>

                    <h3>
                        Forgot Password
                    </h3>

                    <p>
                        Update your account password.
                    </p>

                </Link>
                */}

            </div>


            {/* BACK BUTTON */}

            <button
                type="button"
                className="back-btn"
                onClick={() => navigate("/login")}
            >
                ← Back
            </button>

        </div>
    );
}

export default Dashboard;