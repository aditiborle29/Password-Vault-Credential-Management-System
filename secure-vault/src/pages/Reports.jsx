import { useEffect, useState } from "react";
import axios from "axios";
import "./Reports.css";

function Reports() {

    const [passwordReport, setPasswordReport] = useState(null);
    const [loginReport, setLoginReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API = "http://localhost:8080/api/reports";

    // ==========================================
    // LOAD REPORT DATA
    // ==========================================

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {

        try {

            setLoading(true);
            setError("");

            const passwordResponse =
                await axios.get(
                    `${API}/password-health`
                );

            const loginResponse =
                await axios.get(
                    `${API}/login-activity`
                );

            setPasswordReport(
                passwordResponse.data
            );

            setLoginReport(
                loginResponse.data
            );

        } catch (error) {

            console.error(
                "Error loading reports:",
                error
            );

            setError(
                "Unable to load security reports. Please make sure the backend is running."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

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
                        Fetching security information
                        from the server.
                    </p>
                </div>
            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="reports-container">

                <div className="error-box">

                    <div className="error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Something went wrong
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

            {/* =====================================
                HEADER
            ===================================== */}

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
                        Analyze password health and
                        login activity of your Secure Vault.
                    </p>

                </div>

                <button
                    className="refresh-button"
                    onClick={loadReports}
                >
                    🔄 Refresh
                </button>

            </div>


            {/* =====================================
                PASSWORD HEALTH REPORT
            ===================================== */}

            <section className="report-section">

                <div className="section-heading">

                    <div className="section-icon password-icon">
                        🔑
                    </div>

                    <div className="section-report">
                        <h2>
                            Password Health
                        </h2>

                        <p>
                            Overview of the strength
                            of your stored passwords.
                        </p>
                    </div>

                </div>


                {/* PASSWORD CARDS */}

                <div className="report-cards">

                    {/* TOTAL */}

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

                        <p>
                            Stored credentials
                        </p>

                    </div>


                    {/* STRONG */}

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

                        <p>
                            Excellent protection
                        </p>

                    </div>


                    {/* MEDIUM */}

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

                        <p>
                            Can be improved
                        </p>

                    </div>


                    {/* WEAK */}

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

                        <p>
                            Needs attention
                        </p>

                    </div>

                </div>


                {/* =================================
                    HEALTH SCORE
                ================================= */}

                <div className="health-summary">

                    <div className="health-info">

                        <div>

                            <h3>
                                Overall Password Health
                            </h3>

                            <p>
                                Based on your password
                                strength analysis
                            </p>

                        </div>

                        <div className="health-score">

                            {passwordReport?.healthScore || 0}%

                        </div>

                    </div>


                    {/* PROGRESS BAR */}

                    <div className="health-progress">

                        <div
                            className="health-progress-bar"
                            style={{
                                width: `${passwordReport?.healthScore || 0}%`
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


            {/* =====================================
                LOGIN ACTIVITY REPORT
            ===================================== */}

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
                            Overview of recent login
                            attempts and authentication activity.
                        </p>

                    </div>

                </div>


                {/* LOGIN SUMMARY */}

                <div className="report-cards login-summary">

                    {/* TOTAL */}

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

                        <p>
                            Login attempts recorded
                        </p>

                    </div>


                    {/* SUCCESS */}

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

                        <p>
                            Successful authentication
                        </p>

                    </div>


                    {/* FAILED */}

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

                        <p>
                            Failed authentication
                        </p>

                    </div>

                </div>


                {/* =================================
                    RECENT LOGIN ACTIVITIES
                ================================= */}

                <div className="recent-activity">

                    <div className="recent-heading">

                        <div>

                            <h3>
                                Recent Login Activities
                            </h3>

                            <p>
                                Latest authentication attempts
                            </p>

                        </div>

                    </div>


                    {loginReport?.recentActivities?.length === 0 ? (

                        <div className="empty-state">

                            <div>
                                📭
                            </div>

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

                                    {loginReport?.recentActivities?.map(
                                        (attempt) => (

                                            <tr key={attempt.id}>

                                                <td className="email-cell">

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


                                                <td className="time-cell">

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