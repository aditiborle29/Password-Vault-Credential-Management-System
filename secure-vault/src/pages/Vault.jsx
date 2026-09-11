import React, { useEffect, useState } from "react";
import {
    getCredentials,
    getSharedCredentials,
    deleteCredential,
} from "../services/credentialService";

import { shareCredential } from "../services/sharingService";
import { Link } from "react-router-dom";
import "./Vault.css";

function Vault() {

    const [credentials, setCredentials] = useState([]);
    const [sharedCredentials, setSharedCredentials] = useState([]);

    const [showPassword, setShowPassword] = useState({});

    const [loadingCredentials, setLoadingCredentials] = useState(true);
    const [loadingShared, setLoadingShared] = useState(true);

    const [error, setError] = useState("");
    const [sharedError, setSharedError] = useState("");

    const [deleteLoading, setDeleteLoading] = useState(null);

    const [copyMessage, setCopyMessage] = useState("");

    // ================= SHARE MODAL =================

    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedCredential, setSelectedCredential] = useState(null);
    const [sharedWithEmail, setSharedWithEmail] = useState("");
    const [permission, setPermission] = useState("VIEW");

    const [shareLoading, setShareLoading] = useState(false);
    const [shareError, setShareError] = useState("");
    const [shareSuccess, setShareSuccess] = useState("");


    // ================= LOAD DATA =================

    useEffect(() => {
        loadCredentials();
        loadSharedCredentials();
    }, []);


    // ================= MY CREDENTIALS =================

    const loadCredentials = async () => {

        try {

            setLoadingCredentials(true);
            setError("");

            const response = await getCredentials();

            setCredentials(response.data || []);

        } catch (error) {

            console.error("Load credentials error:", error);

            if (error.response) {

                if (error.response.status === 401) {
                    setError("Your session has expired. Please login again.");
                } else if (error.response.status === 403) {
                    setError("You are not authorized to view your credentials.");
                } else if (error.response.status === 500) {
                    setError("Server error. Please try again later.");
                } else {
                    setError(
                        error.response.data?.message ||
                        "Failed to load credentials."
                    );
                }

            } else if (error.request) {

                setError(
                    "Unable to connect to the server. Please check that the backend is running."
                );

            } else {

                setError("Something went wrong. Please try again.");

            }

        } finally {

            setLoadingCredentials(false);

        }
    };


    // ================= SHARED CREDENTIALS =================

    const loadSharedCredentials = async () => {

        try {

            setLoadingShared(true);
            setSharedError("");

            const response = await getSharedCredentials();

            setSharedCredentials(response.data || []);

        } catch (error) {

            console.error("Load shared credentials error:", error);

            if (error.response) {

                if (error.response.status === 401) {
                    setSharedError(
                        "Your session has expired. Please login again."
                    );
                } else if (error.response.status === 403) {
                    setSharedError(
                        "You are not authorized to view shared credentials."
                    );
                } else if (error.response.status === 500) {
                    setSharedError(
                        "Server error while loading shared credentials."
                    );
                } else {
                    setSharedError(
                        error.response.data?.message ||
                        "Failed to load shared credentials."
                    );
                }

            } else if (error.request) {

                setSharedError(
                    "Unable to connect to the server."
                );

            } else {

                setSharedError(
                    "Something went wrong while loading shared credentials."
                );

            }

        } finally {

            setLoadingShared(false);

        }
    };


    // ================= DELETE =================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this credential?"
        );

        if (!confirmDelete) return;

        try {

            setDeleteLoading(id);
            setError("");

            await deleteCredential(id);

            setCredentials((prev) =>
                prev.filter((credential) => credential.id !== id)
            );

            setCopyMessage("");
            setError("");

        } catch (error) {

            console.error("Delete credential error:", error);

            if (error.response) {

                if (error.response.status === 401) {
                    setError(
                        "Your session has expired. Please login again."
                    );
                } else if (error.response.status === 403) {
                    setError(
                        "You are not authorized to delete this credential."
                    );
                } else if (error.response.status === 404) {
                    setError("Credential was not found.");
                } else if (error.response.status === 500) {
                    setError(
                        "Server error. Unable to delete credential."
                    );
                } else {
                    setError(
                        error.response.data?.message ||
                        "Failed to delete credential."
                    );
                }

            } else if (error.request) {

                setError(
                    "Unable to connect to the server."
                );

            } else {

                setError(
                    "Something went wrong. Please try again."
                );

            }

        } finally {

            setDeleteLoading(null);

        }
    };


    // ================= COPY PASSWORD =================

    const copyPassword = async (password) => {

        try {

            await navigator.clipboard.writeText(password);

            setCopyMessage("Password copied successfully!");

            setTimeout(() => {
                setCopyMessage("");
            }, 2000);

        } catch (error) {

            console.error("Copy error:", error);

            setCopyMessage(
                "Unable to copy password. Please try again."
            );

            setTimeout(() => {
                setCopyMessage("");
            }, 2500);
        }
    };


    // ================= OPEN SHARE MODAL =================

    const handleShare = (credential) => {

        setSelectedCredential(credential);

        setSharedWithEmail("");
        setPermission("VIEW");

        setShareError("");
        setShareSuccess("");

        setShowShareModal(true);
    };


    // ================= SUBMIT SHARE =================

    const submitShare = async () => {

        const ownerEmail = localStorage.getItem("userEmail");

        setShareError("");
        setShareSuccess("");

        if (!ownerEmail) {

            setShareError(
                "Please login again before sharing a credential."
            );

            return;
        }

        if (!sharedWithEmail.trim()) {

            setShareError(
                "Please enter the recipient email."
            );

            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(sharedWithEmail.trim())) {

            setShareError(
                "Please enter a valid email address."
            );

            return;
        }

        if (!selectedCredential) {

            setShareError(
                "No credential selected."
            );

            return;
        }

        if (
            permission !== "VIEW" &&
            permission !== "EDIT"
        ) {

            setShareError(
                "Please select a valid permission."
            );

            return;
        }

        try {

            setShareLoading(true);

            const response = await shareCredential({

                credentialId: selectedCredential.id,

                ownerEmail: ownerEmail,

                sharedWithEmail:
                    sharedWithEmail.trim(),

                permission: permission,
            });

            setShareSuccess(
                response.data ||
                "Credential shared successfully!"
            );

            setTimeout(() => {

                setShowShareModal(false);
                setSelectedCredential(null);
                setSharedWithEmail("");
                setPermission("VIEW");
                setShareSuccess("");

            }, 1000);

        } catch (error) {

            console.error("Share credential error:", error);

            if (error.response) {

                if (error.response.status === 400) {

                    setShareError(
                        error.response.data?.message ||
                        error.response.data ||
                        "Invalid sharing request."
                    );

                } else if (error.response.status === 401) {

                    setShareError(
                        "Your session has expired. Please login again."
                    );

                } else if (error.response.status === 403) {

                    setShareError(
                        "You are not authorized to share this credential."
                    );

                } else if (error.response.status === 404) {

                    setShareError(
                        "Credential or recipient was not found."
                    );

                } else if (error.response.status === 500) {

                    setShareError(
                        "Server error. Please try again later."
                    );

                } else {

                    setShareError(
                        error.response.data?.message ||
                        error.response.data ||
                        "Failed to share credential."
                    );
                }

            } else if (error.request) {

                setShareError(
                    "Unable to connect to the server. Please check your connection."
                );

            } else {

                setShareError(
                    "Something went wrong. Please try again."
                );
            }

        } finally {

            setShareLoading(false);

        }
    };


    // ================= CLOSE SHARE MODAL =================

    const closeShareModal = () => {

        if (shareLoading) return;

        setShowShareModal(false);
        setSelectedCredential(null);
        setSharedWithEmail("");
        setPermission("VIEW");
        setShareError("");
        setShareSuccess("");
    };


    // ================= LOADING =================

    if (loadingCredentials) {

        return (

            <div className="vault-container">

                <div className="vault-card loading-card">

                    <div className="vault-loader"></div>

                    <h2>Loading Vault...</h2>

                    <p>Please wait while your credentials are loaded.</p>

                </div>

            </div>
        );
    }


    return (

        <div className="vault-container">

            <div className="vault-card">

                {/* ================= MY CREDENTIALS ================= */}

                <h2>
                    🔐 My Saved Credentials
                </h2>


                {/* MAIN ERROR */}

                {error && (

                    <div className="vault-error">
                        ⚠️ {error}

                        <button
                            type="button"
                            onClick={loadCredentials}
                        >
                            Retry
                        </button>
                    </div>

                )}


                {/* COPY MESSAGE */}

                {copyMessage && (

                    <div className="copy-message">
                        {copyMessage}
                    </div>

                )}


                {/* CREDENTIAL TABLE */}

                {!error && credentials.length === 0 ? (

                    <div className="no-data">

                        <div className="empty-icon">
                            🔐
                        </div>

                        <p>No credentials found.</p>

                        <Link
                            to="/add"
                            className="add-credential-btn"
                        >
                            ➕ Add Credential
                        </Link>

                    </div>

                ) : !error ? (

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>Website</th>

                                    <th>Username</th>

                                    <th>Password</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {credentials.map(
                                    (credential) => (

                                        <tr
                                            key={credential.id}
                                        >

                                            <td>
                                                {credential.website}
                                            </td>

                                            <td>
                                                {credential.username}
                                            </td>

                                            <td>

                                                {showPassword[
                                                    credential.id
                                                ]
                                                    ? credential.password
                                                    : "••••••••••"}

                                            </td>


                                            <td className="action-buttons">

                                                {/* SHOW */}

                                                <button
                                                    className="show-btn"
                                                    onClick={() =>
                                                        setShowPassword({
                                                            ...showPassword,

                                                            [credential.id]:
                                                                !showPassword[
                                                                    credential.id
                                                                ],
                                                        })
                                                    }
                                                >

                                                    {showPassword[
                                                        credential.id
                                                    ]
                                                        ? "🙈 Hide"
                                                        : "👁 Show"}

                                                </button>


                                                {/* COPY */}

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


                                                {/* EDIT */}

                                                <Link
                                                    className="edit-btn"
                                                    to={`/edit/${credential.id}`}
                                                >
                                                    ✏ Edit
                                                </Link>


                                                {/* SHARE */}

                                                <button
                                                    className="share-btn"
                                                    onClick={() =>
                                                        handleShare(
                                                            credential
                                                        )
                                                    }
                                                >
                                                    🔗 Share
                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    className="delete-btn"
                                                    disabled={
                                                        deleteLoading ===
                                                        credential.id
                                                    }
                                                    onClick={() =>
                                                        handleDelete(
                                                            credential.id
                                                        )
                                                    }
                                                >

                                                    {deleteLoading ===
                                                    credential.id
                                                        ? "⏳"
                                                        : "🗑 Delete"}

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                ) : null}


                {/* ================= SHARED WITH ME ================= */}

                <h2 className="shared-heading">
                    🤝 Shared With Me
                </h2>


                {sharedError && (

                    <div className="vault-error shared-error">
                        ⚠️ {sharedError}

                        <button
                            type="button"
                            onClick={loadSharedCredentials}
                        >
                            Retry
                        </button>
                    </div>

                )}


                {loadingShared ? (

                    <div className="shared-loading">
                        Loading shared credentials...
                    </div>

                ) : !sharedError &&
                  sharedCredentials.length === 0 ? (

                    <p className="no-data">
                        No shared credentials.
                    </p>

                ) : !sharedError ? (

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>Website</th>

                                    <th>Username</th>

                                    <th>Password</th>

                                    <th>Permission</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {sharedCredentials.map(
                                    (shared) => {

                                        const credential =
                                            shared.credential
                                                ? shared.credential
                                                : shared;

                                        const permissionValue =
                                            shared.permission
                                                ? shared.permission.toUpperCase()
                                                : "VIEW";

                                        const displayId =
                                            shared.id ||
                                            credential.id;

                                        const passwordKey =
                                            `s${displayId}`;

                                        return (

                                            <tr
                                                key={`shared-${displayId}`}
                                            >

                                                <td>
                                                    {credential.website}
                                                </td>

                                                <td>
                                                    {credential.username}
                                                </td>

                                                <td>

                                                    {showPassword[
                                                        passwordKey
                                                    ]
                                                        ? credential.password
                                                        : "••••••••••"}

                                                </td>


                                                {/* PERMISSION */}

                                                <td>

                                                    {permissionValue ===
                                                    "EDIT" ? (

                                                        <strong className="permission-edit">
                                                            ✏ EDIT
                                                        </strong>

                                                    ) : (

                                                        <strong className="permission-view">
                                                            👁 VIEW
                                                        </strong>

                                                    )}

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="action-buttons">

                                                    <button
                                                        className="show-btn"
                                                        onClick={() =>
                                                            setShowPassword({
                                                                ...showPassword,

                                                                [passwordKey]:
                                                                    !showPassword[
                                                                        passwordKey
                                                                    ],
                                                            })
                                                        }
                                                    >

                                                        {showPassword[
                                                            passwordKey
                                                        ]
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


                                                    {/* EDIT ONLY FOR EDIT */}

                                                    {permissionValue ===
                                                        "EDIT" && (

                                                        <Link
                                                            className="edit-btn"
                                                            to={`/edit/${credential.id}`}
                                                        >
                                                            ✏ Edit
                                                        </Link>

                                                    )}

                                                </td>

                                            </tr>

                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                ) : null}


                {/* BACK */}

                <Link
                    className="back-btn"
                    to="/dashboard"
                >
                    ← Back to Dashboard
                </Link>

            </div>


            {/* ================= SHARE MODAL ================= */}

            {showShareModal && (

                <div className="share-modal-overlay">

                    <div className="share-modal">

                        <h2>
                            🔗 Share Credential
                        </h2>


                        {selectedCredential && (

                            <div className="selected-credential">

                                <p>
                                    Sharing:
                                    <strong>
                                        {" "}
                                        {selectedCredential.website}
                                    </strong>
                                </p>

                                <p>
                                    Username:
                                    <strong>
                                        {" "}
                                        {selectedCredential.username}
                                    </strong>
                                </p>

                            </div>
                        )}


                        {/* SHARE ERROR */}

                        {shareError && (

                            <div className="modal-error">
                                ⚠️ {shareError}
                            </div>

                        )}


                        {/* SHARE SUCCESS */}

                        {shareSuccess && (

                            <div className="modal-success">
                                ✅ {shareSuccess}
                            </div>

                        )}


                        {/* EMAIL */}

                        <label>
                            Recipient Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter registered user's email"
                            value={sharedWithEmail}
                            onChange={(e) => {
                                setSharedWithEmail(e.target.value);
                                setShareError("");
                            }}
                            autoFocus
                            disabled={shareLoading}
                        />


                        {/* PERMISSION */}

                        <label>
                            Permission
                        </label>

                        <select
                            value={permission}
                            onChange={(e) =>
                                setPermission(e.target.value)
                            }
                            disabled={shareLoading}
                        >

                            <option value="VIEW">
                                VIEW - Can view credential
                            </option>

                            <option value="EDIT">
                                EDIT - Can view and edit credential
                            </option>

                        </select>


                        {/* BUTTONS */}

                        <div className="share-modal-buttons">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={closeShareModal}
                                disabled={shareLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="share-submit-btn"
                                onClick={submitShare}
                                disabled={shareLoading}
                            >

                                {shareLoading
                                    ? "⏳ Sharing..."
                                    : "🔗 Share Credential"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Vault;