import { useEffect, useState } from "react";
import axios from "axios";
import "./SecurityDashboard.css";

function SecurityDashboard() {

    const [loginAttempts, setLoginAttempts] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [suspiciousActivities, setSuspiciousActivities] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const userEmail = localStorage.getItem("userEmail");

    const API = "http://localhost:8080/api/security";

    // ==========================================
    // LOAD SECURITY DATA
    // ==========================================

    useEffect(() => {
        loadSecurityData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadSecurityData = async () => {

        try {

            setLoading(true);
            setRefreshing(true);
            setError("");

            if (!userEmail) {

                setError(
                    "User session not found. Please login again."
                );

                return;
            }

            const encodedEmail =
                encodeURIComponent(userEmail);

            // USER-SPECIFIC LOGIN ATTEMPTS
            const loginResponse =
                await axios.get(
                    `${API}/login-attempts?email=${encodedEmail}`
                );

            // USER-SPECIFIC SECURITY ALERTS
            const alertResponse =
                await axios.get(
                    `${API}/alerts?email=${encodedEmail}`
                );

            // USER-SPECIFIC SUSPICIOUS ACTIVITIES
            const suspiciousResponse =
                await axios.get(
                    `${API}/suspicious-activities?email=${encodedEmail}`
                );

            // USER-SPECIFIC AUDIT LOGS
            const auditResponse =
                await axios.get(
                    `${API}/audit-logs?email=${encodedEmail}`
                );

            setLoginAttempts(
                loginResponse.data
            );

            setAlerts(
                alertResponse.data
            );

            setSuspiciousActivities(
                suspiciousResponse.data
            );

            setAuditLogs(
                auditResponse.data
            );

        } catch (error) {

            console.error(
                "Error loading security data:",
                error
            );

            if (error.response) {

                if (error.response.status === 400) {

                    setError(
                        error.response.data?.message ||
                        "Email is required."
                    );

                } else if (error.response.status === 401) {

                    setError(
                        "You are not authorized to access security monitoring."
                    );

                } else if (error.response.status === 403) {

                    setError(
                        "Access denied."
                    );

                } else if (error.response.status === 500) {

                    setError(
                        "Server error while loading security data."
                    );

                } else {

                    setError(
                        error.response.data?.message ||
                        "Unable to load security data."
                    );
                }

            } else if (error.request) {

                setError(
                    "Unable to connect to backend. Please make sure Spring Boot is running."
                );

            } else {

                setError(
                    "Something went wrong while loading security data."
                );
            }

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    // ==========================================
    // RESOLVE ALERT
    // ==========================================

    const resolveAlert = async (id) => {

        try {

            if (!userEmail) {
                setError(
                    "User session not found. Please login again."
                );
                return;
            }

            const encodedEmail =
                encodeURIComponent(userEmail);

            await axios.put(
                `${API}/alerts/${id}/resolve?email=${encodedEmail}`
            );

            await loadSecurityData();

        } catch (error) {

            console.error(
                "Error resolving alert:",
                error
            );

            if (error.response) {

                if (error.response.status === 403) {

                    setError(
                        "You are not allowed to resolve this alert."
                    );

                } else if (error.response.status === 404) {

                    setError(
                        "Security alert not found."
                    );

                } else {

                    setError(
                        error.response.data?.message ||
                        "Failed to resolve security alert."
                    );
                }

            } else if (error.request) {

                setError(
                    "Unable to connect to the backend."
                );

            } else {

                setError(
                    "Something went wrong while resolving the alert."
                );
            }
        }
    };


    // ==========================================
    // SESSION ERROR
    // ==========================================

    if (!userEmail) {

        return (
            <div className="security-dashboard">

                <div className="security-section">

                    <div className="no-data">

                        <h2>
                            ⚠️ Session Expired
                        </h2>

                        <p>
                            Please login again to access
                            Security Monitoring.
                        </p>

                        <button
                            className="resolve-button"
                            onClick={() => {
                                window.location.href = "/login";
                            }}
                        >
                            Go to Login
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="security-dashboard">

                <div className="security-section">

                    <div className="no-data">

                        <h2>
                            🔐 Loading Security Monitoring...
                        </h2>

                        <p>
                            Loading security information
                            for <strong>{userEmail}</strong>.
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="security-dashboard">

                <div className="security-section">

                    <div className="no-data">

                        <h2>
                            ⚠️ Unable to Load Security Data
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            className="resolve-button"
                            onClick={loadSecurityData}
                            disabled={refreshing}
                        >
                            {refreshing
                                ? "Loading..."
                                : "Retry"}
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    return (

        <div className="security-dashboard">

            {/* ======================================
                HEADER
            ====================================== */}

            <div className="security-header">

                <div>

                    <h1>
                        🛡️ Security Monitoring
                    </h1>

                    <p>
                        Monitor login activity, suspicious
                        activities, security alerts and audit logs.
                    </p>

                    <p>
                        👤 Logged in as:
                        <strong> {userEmail}</strong>
                    </p>

                </div>

                <button
                    className="resolve-button"
                    onClick={loadSecurityData}
                    disabled={refreshing}
                >
                    {refreshing
                        ? "Refreshing..."
                        : "🔄 Refresh"}
                </button>

            </div>


            {/* ======================================
                SUMMARY CARDS
            ====================================== */}

            <div className="security-cards">

                {/* LOGIN ATTEMPTS */}

                <div className="security-card">

                    <div className="security-card-icon">
                        🔐
                    </div>

                    <div>

                        <h3>
                            Login Attempts
                        </h3>

                        <h2>
                            {loginAttempts.length}
                        </h2>

                    </div>

                </div>


                {/* SECURITY ALERTS */}

                <div className="security-card alert-card">

                    <div className="security-card-icon">
                        🚨
                    </div>

                    <div>

                        <h3>
                            Security Alerts
                        </h3>

                        <h2>
                            {alerts.length}
                        </h2>

                    </div>

                </div>


                {/* SUSPICIOUS ACTIVITIES */}

                <div className="security-card warning-card">

                    <div className="security-card-icon">
                        ⚠️
                    </div>

                    <div>

                        <h3>
                            Suspicious Activities
                        </h3>

                        <h2>
                            {suspiciousActivities.length}
                        </h2>

                    </div>

                </div>


                {/* AUDIT LOGS */}

                <div className="security-card">

                    <div className="security-card-icon">
                        📋
                    </div>

                    <div>

                        <h3>
                            Audit Logs
                        </h3>

                        <h2>
                            {auditLogs.length}
                        </h2>

                    </div>

                </div>

            </div>


            {/* ======================================
                SECURITY ALERTS
            ====================================== */}

            <section className="security-section">

                <div className="section-title">

                    <h2>
                        🚨 Security Alerts
                    </h2>

                </div>


                {alerts.length === 0 ? (

                    <p className="no-data">
                        No security alerts found for your account.
                    </p>

                ) : (

                    <div className="table-wrapper">

                        <table className="security-table">

                            <thead>

                                <tr>

                                    <th>ID</th>
                                    <th>Alert Type</th>
                                    <th>Message</th>
                                    <th>Severity</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Action</th>

                                </tr>

                            </thead>


                            <tbody>

                                {alerts.map((alertItem) => (

                                    <tr key={alertItem.id}>

                                        <td>
                                            {alertItem.id}
                                        </td>

                                        <td>
                                            <span className="activity-type">
                                                {alertItem.alertType}
                                            </span>
                                        </td>

                                        <td>
                                            {alertItem.message}
                                        </td>

                                        <td>

                                            <span className="status-high">
                                                {alertItem.severity}
                                            </span>

                                        </td>

                                        <td>
                                            {new Date(
                                                alertItem.timestamp
                                            ).toLocaleString()}
                                        </td>

                                        <td>

                                            {alertItem.resolved ? (

                                                <span className="status-resolved">
                                                    Resolved
                                                </span>

                                            ) : (

                                                <span className="status-active">
                                                    Active
                                                </span>

                                            )}

                                        </td>

                                        <td>

                                            {!alertItem.resolved && (

                                                <button
                                                    onClick={() =>
                                                        resolveAlert(
                                                            alertItem.id
                                                        )
                                                    }
                                                    className="resolve-button"
                                                >
                                                    Resolve
                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* ======================================
                SUSPICIOUS ACTIVITIES
            ====================================== */}

            <section className="security-section">

                <div className="section-title">

                    <h2>
                        ⚠️ Suspicious Activities
                    </h2>

                </div>


                {suspiciousActivities.length === 0 ? (

                    <p className="no-data">
                        No suspicious activities found for your account.
                    </p>

                ) : (

                    <div className="table-wrapper">

                        <table className="security-table">

                            <thead>

                                <tr>

                                    <th>ID</th>
                                    <th>Activity</th>
                                    <th>Description</th>
                                    <th>Detected At</th>
                                    <th>Status</th>

                                </tr>

                            </thead>


                            <tbody>

                                {suspiciousActivities.map(
                                    (activity) => (

                                        <tr key={activity.id}>

                                            <td>
                                                {activity.id}
                                            </td>

                                            <td>
                                                <span className="activity-type">
                                                    {activity.activityType}
                                                </span>
                                            </td>

                                            <td>
                                                {activity.description}
                                            </td>

                                            <td>
                                                {new Date(
                                                    activity.detectedAt
                                                ).toLocaleString()}
                                            </td>

                                            <td>

                                                <span className="status-flagged">
                                                    {activity.status}
                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* ======================================
                LOGIN ATTEMPTS
            ====================================== */}

            <section className="security-section">

                <div className="section-title">

                    <h2>
                        🔐 Recent Login Attempts
                    </h2>

                </div>


                {loginAttempts.length === 0 ? (

                    <p className="no-data">
                        No login attempts found for your account.
                    </p>

                ) : (

                    <div className="table-wrapper">

                        <table className="security-table">

                            <thead>

                                <tr>

                                    <th>Result</th>
                                    <th>Timestamp</th>

                                </tr>

                            </thead>


                            <tbody>

                                {loginAttempts.map((attempt) => (

                                    <tr key={attempt.id}>

                                        <td>

                                            {attempt.success ? (

                                                <span className="status-success">
                                                    SUCCESS
                                                </span>

                                            ) : (

                                                <span className="status-failed">
                                                    FAILED
                                                </span>

                                            )}

                                        </td>

                                        <td>
                                            {new Date(
                                                attempt.timestamp
                                            ).toLocaleString()}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* ======================================
                AUDIT LOGS
            ====================================== */}

            <section className="security-section">

                <div className="section-title">

                    <h2>
                        📋 Audit Logs
                    </h2>

                </div>


                {auditLogs.length === 0 ? (

                    <p className="no-data">
                        No audit logs found for your account.
                    </p>

                ) : (

                    <div className="table-wrapper">

                        <table className="security-table">

                            <thead>

                                <tr>

                                    <th>Action</th>
                                    <th>Description</th>
                                    <th>Timestamp</th>

                                </tr>

                            </thead>


                            <tbody>

                                {auditLogs.map((log) => (

                                    <tr key={log.id}>

                                        <td>

                                            <span className="action-type">
                                                {log.action}
                                            </span>

                                        </td>

                                        <td>
                                            {log.description}
                                        </td>

                                        <td>
                                            {new Date(
                                                log.timestamp
                                            ).toLocaleString()}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>
    );
}

export default SecurityDashboard;