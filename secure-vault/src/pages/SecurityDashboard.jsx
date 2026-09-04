import { useEffect, useState } from "react";
import axios from "axios";
import "./SecurityDashboard.css";

function SecurityDashboard() {

  const [loginAttempts, setLoginAttempts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [suspiciousActivities, setSuspiciousActivities] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const API = "http://localhost:8080/api/security";

  // ==========================================
  // LOAD SECURITY DATA
  // ==========================================

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {

      const loginResponse =
        await axios.get(`${API}/login-attempts`);

      const alertResponse =
        await axios.get(`${API}/alerts`);

      const suspiciousResponse =
        await axios.get(`${API}/suspicious-activities`);

      const auditResponse =
        await axios.get(`${API}/audit-logs`);

      setLoginAttempts(loginResponse.data);
      setAlerts(alertResponse.data);
      setSuspiciousActivities(suspiciousResponse.data);
      setAuditLogs(auditResponse.data);

    } catch (error) {

      console.error(
        "Error loading security data:",
        error
      );

    }
  };


  // ==========================================
  // RESOLVE ALERT
  // ==========================================

  const resolveAlert = async (id) => {

    try {

      await axios.put(
        `${API}/alerts/${id}/resolve`
      );

      alert("Security alert resolved successfully");

      loadSecurityData();

    } catch (error) {

      console.error(
        "Error resolving alert:",
        error
      );

      alert("Failed to resolve security alert");
    }
  };


  return (

    <div className="security-dashboard">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="security-header">

        <h1>
          🛡️ Security Monitoring
        </h1>

        <p>
          Monitor login activity, suspicious activities,
          security alerts and audit logs.
        </p>

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
            <h3>Login Attempts</h3>

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
            <h3>Security Alerts</h3>
            
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
            <h3>Suspicious Activities</h3>

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
            <h3>Audit Logs</h3>

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
            No security alerts found.
          </p>

        ) : (

          <div className="table-wrapper">

            <table className="security-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Email</th>
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
                      {alertItem.email}
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
                            resolveAlert(alertItem.id)
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
            No suspicious activities found.
          </p>

        ) : (

          <div className="table-wrapper">

            <table className="security-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Email</th>
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
                        {activity.userEmail}
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
            No login attempts found.
          </p>

        ) : (

          <div className="table-wrapper">

            <table className="security-table">

              <thead>

                <tr>
                    
                  <th>Email</th>
                  <th>IP Address</th>
                  <th>Result</th>
                  <th>Timestamp</th>
                </tr>

              </thead>


              <tbody>

                {loginAttempts.map((attempt) => (

                  <tr key={attempt.id}>


                    <td>
                      {attempt.email}
                    </td>

                    <td>
                      <span className="ip-address">
                        {attempt.ipAddress}
                      </span>
                    </td>

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
            No audit logs found.
          </p>

        ) : (

          <div className="table-wrapper">

            <table className="security-table">

              <thead>

                <tr>
                  
                  <th>Email</th>
                  <th>Action</th>
                  <th>Description</th>
                  <th>Timestamp</th>
                </tr>

              </thead>


              <tbody>

                {auditLogs.map((log) => (

                  <tr key={log.id}>

                    

                    <td>
                      {log.userEmail}
                    </td>

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