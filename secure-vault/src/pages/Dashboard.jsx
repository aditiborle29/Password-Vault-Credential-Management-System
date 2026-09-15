import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import { API_URL } from "../config";

function Dashboard() {

    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);


    // =====================================================
    // FORMAT NOTIFICATION TIME
    // =====================================================

    const formatNotificationTime = (dateTime) => {

        if (!dateTime) {
            return "";
        }

        try {

            /*
             * createdAt comes from Java LocalDateTime.
             * The backend is already storing the time in
             * Asia/Kolkata timezone.
             *
             * Therefore, we should NOT use:
             *
             * new Date(dateTime)
             *
             * because Java LocalDateTime does not contain
             * timezone information and JavaScript may apply
             * an unwanted timezone conversion.
             */

            const [datePart, timePart] =
                dateTime.split("T");

            if (!datePart || !timePart) {
                return dateTime;
            }

            const [year, month, day] =
                datePart.split("-");

            const timeParts =
                timePart.split(":");

            const hour =
                Number(timeParts[0]);

            const minute =
                Number(timeParts[1]);

            const second =
                Number(
                    timeParts[2]?.split(".")[0] || 0
                );


            // =================================================
            // CONVERT 24-HOUR TIME TO 12-HOUR TIME
            // =================================================

            const period =
                hour >= 12 ? "PM" : "AM";

            const hour12 =
                hour === 0
                    ? 12
                    : hour > 12
                        ? hour - 12
                        : hour;


            // =================================================
            // MONTH NAMES
            // =================================================

            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ];


            // =================================================
            // RETURN FORMATTED TIME
            // =================================================

            return (
                `${day} ${months[Number(month) - 1]} ${year}, ` +
                `${String(hour12).padStart(2, "0")}:` +
                `${String(minute).padStart(2, "0")}:` +
                `${String(second).padStart(2, "0")} ${period}`
            );

        } catch (error) {

            console.error(
                "Time Formatting Error:",
                error
            );

            return dateTime;
        }
    };


    // =====================================================
    // GET NOTIFICATIONS
    // =====================================================

    const getNotifications = () => {

        const email =
            localStorage.getItem("userEmail");

        if (!email) {
            return;
        }

        axios.get(
            `${API_URL}/api/notifications?email=${encodeURIComponent(email)}`
        )
        .then((response) => {

            setNotifications(response.data);

        })
        .catch((error) => {

            console.error(
                "Notification Error:",
                error
            );

        });
    };


    // =====================================================
    // LOAD NOTIFICATIONS
    // =====================================================

    useEffect(() => {

        getNotifications();

    }, []);


    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    const markAllAsRead = () => {

        const email =
            localStorage.getItem("userEmail");

        if (!email) {
            return;
        }

        axios.put(
            `${API_URL}/api/notifications/read-all?email=${encodeURIComponent(email)}`
        )
        .then(() => {

            setNotifications(
                (previousNotifications) =>
                    previousNotifications.map(
                        (notification) => ({
                            ...notification,
                            read: true
                        })
                    )
            );

        })
        .catch((error) => {

            console.error(
                "Mark All Read Error:",
                error
            );

        });
    };


    // =====================================================
    // MARK SINGLE NOTIFICATION AS READ
    // =====================================================

    const markAsRead = (notificationId) => {

        axios.put(
            `${API_URL}/api/notifications/${notificationId}/read`
        )
        .then(() => {

            setNotifications(
                (previousNotifications) =>
                    previousNotifications.map(
                        (notification) =>
                            notification.id === notificationId
                                ? {
                                    ...notification,
                                    read: true
                                }
                                : notification
                    )
            );

        })
        .catch((error) => {

            console.error(
                "Mark Read Error:",
                error
            );

        });
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("userEmail");

        navigate("/login");
    };


    // =====================================================
    // UNREAD NOTIFICATION COUNT
    // =====================================================

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.read
        ).length;


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="dashboard-container">


            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <div className="navbar">


                {/* LOGO */}

                <h2>
                    🔐 Secure Vault
                </h2>


                {/* RIGHT NAVIGATION */}

                <div className="nav-links">


                    {/* SECURITY */}

                    <Link
                        to="/security"
                        className="security-link"
                    >
                        🛡️ Security
                    </Link>


                    {/* =================================================
                        NOTIFICATION BELL
                    ================================================= */}

                    <div className="notification-wrapper">


                        <button
                            type="button"
                            className="notification-btn"
                            onClick={() =>
                                setShowNotifications(
                                    !showNotifications
                                )
                            }
                            aria-label="Notifications"
                        >

                            <span className="bell-icon">
                                🔔
                            </span>


                            {/* UNREAD BADGE */}

                            {unreadCount > 0 && (

                                <span className="notification-badge">
                                    {unreadCount}
                                </span>

                            )}

                        </button>


                        {/* =================================================
                            NOTIFICATION DROPDOWN
                        ================================================= */}

                        {showNotifications && (

                            <div className="notification-dropdown">


                                {/* HEADER */}

                                <div className="notification-header">

                                    <h3>
                                        🔔 Notifications
                                    </h3>


                                    {unreadCount > 0 && (

                                        <button
                                            type="button"
                                            className="mark-read-btn"
                                            onClick={markAllAsRead}
                                        >
                                            Mark all as read
                                        </button>

                                    )}

                                </div>


                                {/* =================================================
                                    NOTIFICATION LIST
                                ================================================= */}

                                <div className="notification-list">


                                    {/* NO NOTIFICATIONS */}

                                    {notifications.length === 0 ? (

                                        <p className="no-notifications">
                                            No notifications.
                                        </p>

                                    ) : (

                                        notifications.map(
                                            (notification) => (

                                                <div
                                                    key={notification.id}
                                                    className={
                                                        notification.read
                                                            ? "notification-item"
                                                            : "notification-item unread"
                                                    }
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id
                                                        )
                                                    }
                                                >


                                                    {/* NOTIFICATION ICON */}

                                                    <div className="notification-item-icon">

                                                        {notification.type === "SECURITY_ALERT"
                                                            ? "🚨"
                                                            : notification.type === "LOGIN"
                                                                ? "🔐"
                                                                : notification.type === "SHARING"
                                                                    ? "🔗"
                                                                    : "🔔"}

                                                    </div>


                                                    {/* NOTIFICATION CONTENT */}

                                                    <div className="notification-content">


                                                        {/* TITLE */}

                                                        <h4>
                                                            {notification.title}
                                                        </h4>


                                                        {/* MESSAGE */}

                                                        <p>
                                                            {notification.message}
                                                        </p>


                                                        {/* TIME */}

                                                        <small>
                                                            {formatNotificationTime(
                                                                notification.createdAt
                                                            )}
                                                        </small>

                                                    </div>

                                                </div>

                                            )
                                        )

                                    )}

                                </div>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        LOGOUT
                    ================================================= */}

                    <button
                        type="button"
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>


            {/* =====================================================
                WELCOME SECTION
            ===================================================== */}

            <div className="welcome">

                <h1>
                    Welcome 👋
                </h1>

                <p>
                    Manage your credentials securely in one place.
                </p>

            </div>


            {/* =====================================================
                DASHBOARD CARDS
            ===================================================== */}

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


                {/* SHARED */}

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


                {/* SECURITY REPORTS */}

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

            </div>


            {/* =====================================================
                BACK BUTTON
            ===================================================== */}

            <button
                type="button"
                className="back-btn"
                onClick={() =>
                    navigate("/login")
                }
            >
                ← Back
            </button>

        </div>
    );
}

export default Dashboard;
