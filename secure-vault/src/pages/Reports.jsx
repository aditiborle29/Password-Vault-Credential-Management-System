import { useEffect, useState } from "react";
import axios from "axios";
import "./Reports.css";

function Reports() {
    const [passwordReport, setPasswordReport] = useState(null);
    const [loginReport, setLoginReport] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userEmail = localStorage.getItem("userEmail");

    const API = "http://localhost:8080/api/reports";

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            setError("");

            if (!userEmail) {
                setError("User session not found. Please login again.");
                return;
            }

            console.log("Reports user:", userEmail);

            const encodedEmail = encodeURIComponent(userEmail);

            const passwordResponse = await axios.get(
                `${API}/password-health?email=${encodedEmail}`
            );

            console.log(
                "Password Report:",
                passwordResponse.data
            );

            const loginResponse = await axios.get(
                `${API}/login-activity?email=${encodedEmail}`
            );

            console.log(
                "Login Report:",
                loginResponse.data
            );

            setPasswordReport(passwordResponse.data);
            setLoginReport(loginResponse.data);

        } catch (err) {
            console.error("Reports error:", err);

            if (err.response) {
                setError(
                    err.response.data?.message ||
                    `Server error: ${err.response.status}`
                );
            } else if (err.request) {
                setError(
                    "Backend is not reachable."
                );
            } else {
                setError(
                    "Unable to load security reports."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (!userEmail) {
        return (
            <div className="reports-container">
                <div className="error-box">
                    <h2>Session Expired</h2>
                    <p>Please login again.</p>

                    <button
                        className="retry-button"
                        onClick={() => {
                            window.location.href = "/login";
                        }}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="reports-loading">
                <div className="loading-box">
                    <div className="loading-icon">
                        🔐
                    </div>

                    <h2>
                        Loading Security Reports...
                    </h2>

                    <p>
                        Loading reports for {userEmail}
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="reports-container">
                <div className="error-box">

                    <div className="error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Unable to Load Reports
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="retry-button"
                        onClick={loadReports}
                    >
                        Try Again
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="reports-container">

            {/* HEADER */}

            <div className="reports-header">

                <div className="title">

                    <div className="header-title">

                        <span className="header-icon">
                            📊
                        </span>

                        <h1>
                            Security Reports
                        </h1>

                    </div>

                    <p>
                        Password health and login activity
                        for your account.
                    </p>

                    <p className="logged-user">
                        👤 {userEmail}
                    </p>

                </div>

                <button
                    className="refresh-button"
                    onClick={loadReports}
                >
                    🔄 Refresh
                </button>

            </div>


            {/* PASSWORD HEALTH */}

            <section className="report-section">

                <div className="section-heading">

                    <div className="section-icon password-icon">
                        🔑
                    </div>

                    <div>
                        <h2>Password Health</h2>

                        <p>
                            Strength of your stored passwords.
                        </p>
                    </div>

                </div>


                <div className="report-cards">

                    <div className="report-card total-card">

                        <div className="card-icon">
                            🔐
                        </div>

                        <h3>
                            Total Credentials
                        </h3>

                        <h1>
                            {passwordReport?.totalCredentials || 0}
                        </h1>

                    </div>


                    <div className="report-card strong-card">

                        <div className="card-icon">
                            🟢
                        </div>

                        <h3>
                            Strong Passwords
                        </h3>

                        <h1 className="strong-number">
                            {passwordReport?.strongPasswords || 0}
                        </h1>

                    </div>


                    <div className="report-card medium-card">

                        <div className="card-icon">
                            🟡
                        </div>

                        <h3>
                            Medium Passwords
                        </h3>

                        <h1 className="medium-number">
                            {passwordReport?.mediumPasswords || 0}
                        </h1>

                    </div>


                    <div className="report-card weak-card">

                        <div className="card-icon">
                            🔴
                        </div>

                        <h3>
                            Weak Passwords
                        </h3>

                        <h1 className="weak-number">
                            {passwordReport?.weakPasswords || 0}
                        </h1>

                    </div>

                </div>


                <div className="health-summary">

                    <div className="health-info">

                        <div>
                            <h3>
                                Overall Password Health
                            </h3>

                            <p>
                                Based on your password strength.
                            </p>
                        </div>

                        <div className="health-score">
                            {passwordReport?.healthScore || 0}%
                        </div>

                    </div>

                    <div className="health-progress">

                        <div
                            className="health-progress-bar"
                            style={{
                                width: `${Math.min(
                                    passwordReport?.healthScore || 0,
                                    100
                                )}%`
                            }}
                        />

                    </div>

                    <div className="health-status">

                        <span>
                            {passwordReport?.overallHealth || "Unknown"}
                        </span>

                    </div>

                </div>

            </section>


            {/* LOGIN ACTIVITY */}

            <section className="report-section">

                <div className="section-heading">

                    <div className="section-icon login-icon">
                        🔐
                    </div>

                    <div>
                        <h2>
                            Login Activity
                        </h2>

                        <p>
                            Your recent login attempts.
                        </p>
                    </div>

                </div>


                <div className="report-cards">

                    <div className="report-card total-card">

                        <div className="card-icon">
                            📈
                        </div>

                        <h3>
                            Total Attempts
                        </h3>

                        <h1>
                            {loginReport?.totalAttempts || 0}
                        </h1>

                    </div>


                    <div className="report-card strong-card">

                        <div className="card-icon">
                            ✅
                        </div>

                        <h3>
                            Successful Logins
                        </h3>

                        <h1 className="strong-number">
                            {loginReport?.successfulLogins || 0}
                        </h1>

                    </div>


                    <div className="report-card weak-card">

                        <div className="card-icon">
                            ❌
                        </div>

                        <h3>
                            Failed Logins
                        </h3>

                        <h1 className="weak-number">
                            {loginReport?.failedLogins || 0}
                        </h1>

                    </div>

                </div>


                <div className="recent-activity">

                    <h3>
                        Recent Login Activities
                    </h3>

                    {!loginReport?.recentActivities ||
                    loginReport.recentActivities.length === 0 ? (

                        <div className="empty-state">

                            <div>📭</div>

                            <p>
                                No login activities found.
                            </p>

                        </div>

                    ) : (

                        <div className="report-table-container">

                            <table className="report-table">

                                <thead>
                                    <tr>
                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Result
                                        </th>

                                        <th>
                                            Timestamp
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {loginReport.recentActivities.map(
                                        (attempt) => (

                                            <tr key={attempt.id}>

                                                <td>
                                                    {attempt.email}
                                                </td>

                                                <td>

                                                    {attempt.success ? (

                                                        <span className="status-badge success-badge">
                                                            ✓ SUCCESS
                                                        </span>

                                                    ) : (

                                                        <span className="status-badge failed-badge">
                                                            ✕ FAILED
                                                        </span>
                                                    )}

                                                </td>

                                                <td>
                                                    {new Date(
                                                        attempt.timestamp
                                                    ).toLocaleString()}
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </section>

        </div>
    );
}

export default Reports;