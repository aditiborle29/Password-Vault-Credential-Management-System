import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSharedCredentials } from "../services/sharingService";
import "./SharedCredentials.css";

function SharedCredentials() {

    const [credentials, setCredentials] = useState([]);
    const [showPassword, setShowPassword] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copyMessage, setCopyMessage] = useState("");

    useEffect(() => {
        loadSharedCredentials();
    }, []);

    const loadSharedCredentials = async () => {

        try {
            setLoading(true);
            setError("");

            const response = await getSharedCredentials();

            console.log("SHARED CREDENTIALS:", response.data);

            setCredentials(response.data || []);

        } catch (error) {

            console.error("Shared credential error:", error);

            if (error.response) {

                if (error.response.status === 401) {
                    setError(
                        "You are not authorized. Please login again."
                    );
                }
                else if (error.response.status === 403) {
                    setError(
                        "You do not have permission to view shared credentials."
                    );
                }
                else if (error.response.status === 404) {
                    setError(
                        "Shared credentials service was not found."
                    );
                }
                else if (error.response.status >= 500) {
                    setError(
                        "Server error. Please try again later."
                    );
                }
                else {
                    setError(
                        error.response.data?.message ||
                        "Failed to load shared credentials."
                    );
                }

            } else if (error.request) {

                setError(
                    "Unable to connect to the server. Please make sure the backend is running."
                );

            } else {

                setError(
                    "Something went wrong. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };


    const togglePassword = (id) => {

        setShowPassword((previous) => ({
            ...previous,
            [id]: !previous[id]
        }));
    };


    const copyPassword = async (password) => {

        try {

            await navigator.clipboard.writeText(password);

            setCopyMessage("Password copied successfully!");

            setTimeout(() => {
                setCopyMessage("");
            }, 2500);

        } catch (error) {

            console.error("Copy error:", error);

            setCopyMessage(
                "Unable to copy password."
            );

            setTimeout(() => {
                setCopyMessage("");
            }, 2500);
        }
    };


    return (

        <div className="shared-container">

            <div className="shared-card">

                {/* Header */}

                <div className="shared-header">

                    <h2>
                        🔗 Shared Credentials
                    </h2>

                    <p>
                        Credentials that other users have shared with you.
                    </p>

                </div>


                {/* Copy Message */}

                {copyMessage && (
                    <div className="copy-message">
                        {copyMessage}
                    </div>
                )}


                {/* Error */}

                {error && (

                    <div className="shared-error">

                        <p>
                            ⚠️ {error}
                        </p>

                        <button
                            className="retry-btn"
                            onClick={loadSharedCredentials}
                        >
                            🔄 Retry
                        </button>

                    </div>

                )}


                {/* Loading */}

                {loading && (

                    <div className="shared-loading">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading shared credentials...
                        </p>

                    </div>

                )}


                {/* Empty State */}

                {!loading &&
                    !error &&
                    credentials.length === 0 && (

                        <div className="no-data">

                            <div className="empty-icon">
                                🔗
                            </div>

                            <h3>
                                No Shared Credentials
                            </h3>

                            <p>
                                No credentials have been shared with you yet.
                            </p>

                        </div>

                    )}


                {/* Credentials */}

                {!loading &&
                    !error &&
                    credentials.length > 0 && (

                        <div className="shared-table-wrapper">

                            <table className="shared-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Website
                                        </th>

                                        <th>
                                            Username
                                        </th>

                                        <th>
                                            Password
                                        </th>

                                        <th>
                                            Permission
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {credentials.map((credential) => (

                                        <tr key={credential.id}>

                                            <td data-label="Website">
                                                {credential.website}
                                            </td>


                                            <td data-label="Username">
                                                {credential.username}
                                            </td>


                                            <td
                                                data-label="Password"
                                                className="password-cell"
                                            >

                                                {showPassword[credential.id]
                                                    ? credential.password
                                                    : "••••••••••"}

                                            </td>


                                            <td data-label="Permission">

                                                <span
                                                    className={
                                                        credential.permission &&
                                                        credential.permission.toUpperCase() === "EDIT"
                                                            ? "permission edit-permission"
                                                            : "permission view-permission"
                                                    }
                                                >
                                                    {credential.permission || "VIEW"}
                                                </span>

                                            </td>


                                            <td
                                                data-label="Actions"
                                                className="action-buttons"
                                            >

                                                <button
                                                    className="show-btn"
                                                    onClick={() =>
                                                        togglePassword(
                                                            credential.id
                                                        )
                                                    }
                                                >

                                                    {showPassword[credential.id]
                                                        ? "🙈 Hide"
                                                        : "👁 Show"}

                                                </button>


                                                <button
                                                    className="copy-btn"
                                                    onClick={() =>
                                                        copyPassword(
                                                            credential.password
                                                        )
                                                    }
                                                >
                                                    📋 Copy
                                                </button>


                                                {credential.permission &&
                                                    credential.permission.toUpperCase() === "EDIT" && (

                                                        <Link
                                                            className="edit-btn"
                                                            to={`/edit/${credential.id}`}
                                                        >
                                                            ✏ Edit
                                                        </Link>

                                                    )}

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}


                {/* Back Button */}

                <div className="shared-footer">

                    <Link
                        className="back-btn"
                        to="/dashboard"
                    >
                        ← Back to Dashboard
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default SharedCredentials;