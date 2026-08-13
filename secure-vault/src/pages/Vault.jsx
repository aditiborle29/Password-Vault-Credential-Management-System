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


    // ================= SHARE MODAL =================

    const [showShareModal, setShowShareModal] = useState(false);

    const [selectedCredential, setSelectedCredential] = useState(null);

    const [sharedWithEmail, setSharedWithEmail] = useState("");

    const [permission, setPermission] = useState("VIEW");


    // ================= LOAD DATA =================

    useEffect(() => {

        loadCredentials();

        loadSharedCredentials();

    }, []);


    // ================= MY CREDENTIALS =================

    const loadCredentials = async () => {

        try {

            const response = await getCredentials();

            setCredentials(response.data);

        } catch (error) {

            console.error(error);

            alert("Failed to load credentials");

        }

    };


    // ================= SHARED CREDENTIALS =================

    const loadSharedCredentials = async () => {

        try {

            const response = await getSharedCredentials();

            setSharedCredentials(response.data);

        } catch (error) {

            console.error(error);

            console.log("Failed to load shared credentials");

        }

    };


    // ================= DELETE =================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this credential?"
        );

        if (!confirmDelete) return;


        try {

            await deleteCredential(id);

            alert("Credential Deleted Successfully");

            loadCredentials();

        } catch (error) {

            console.error(error);

            alert("Failed to delete credential");

        }

    };


    // ================= COPY =================

    const copyPassword = (password) => {

        navigator.clipboard.writeText(password);

        alert("Password Copied Successfully!");

    };


    // ================= OPEN SHARE MODAL =================

    const handleShare = (credential) => {

        setSelectedCredential(credential);

        setSharedWithEmail("");

        setPermission("VIEW");

        setShowShareModal(true);

    };


    // ================= SUBMIT SHARE =================

    const submitShare = async () => {

        const ownerEmail =
            localStorage.getItem("userEmail");


        if (!ownerEmail) {

            alert("Please login again.");

            return;

        }


        if (!sharedWithEmail.trim()) {

            alert("Please enter recipient email.");

            return;

        }


        if (
            permission !== "VIEW" &&
            permission !== "EDIT"
        ) {

            alert("Invalid permission.");

            return;

        }


        try {

            const response = await shareCredential({

                credentialId: selectedCredential.id,

                ownerEmail: ownerEmail,

                sharedWithEmail:
                    sharedWithEmail.trim(),

                permission: permission,

            });


            alert(response.data);


            // Close modal

            setShowShareModal(false);

            setSelectedCredential(null);

            setSharedWithEmail("");

            setPermission("VIEW");


        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data ||
                    "Failed to share credential."
                );

            } else {

                alert("Failed to share credential.");

            }

        }

    };


    // ================= CLOSE SHARE MODAL =================

    const closeShareModal = () => {

        setShowShareModal(false);

        setSelectedCredential(null);

        setSharedWithEmail("");

        setPermission("VIEW");

    };


    return (

        <div className="vault-container">

            <div className="vault-card">


                {/* ================================================= */}
                {/* MY CREDENTIALS */}
                {/* ================================================= */}

                <h2>
                    🔐 My Saved Credentials
                </h2>


                {credentials.length === 0 ? (

                    <p className="no-data">
                        No credentials found.
                    </p>

                ) : (

                    <table>

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
                                    Actions
                                </th>

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

                                                onClick={() =>
                                                    handleDelete(
                                                        credential.id
                                                    )
                                                }

                                            >

                                                🗑 Delete

                                            </button>


                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}


                {/* ================================================= */}
                {/* SHARED WITH ME */}
                {/* ================================================= */}

                <h2
                    style={{
                        marginTop: "40px"
                    }}
                >

                    🤝 Shared With Me

                </h2>


                {sharedCredentials.length === 0 ? (

                    <p className="no-data">

                        No shared credentials.

                    </p>

                ) : (

                    <table>

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

                            {sharedCredentials.map(
                                (shared) => {

                                    /*
                                     * Depending on your backend,
                                     * shared credential may be returned
                                     * directly OR inside shared.credential.
                                     */

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


                                    return (

                                        <tr
                                            key={`shared-${displayId}`}
                                        >


                                            {/* WEBSITE */}

                                            <td>
                                                {credential.website}
                                            </td>


                                            {/* USERNAME */}

                                            <td>
                                                {credential.username}
                                            </td>


                                            {/* PASSWORD */}

                                            <td>

                                                {showPassword[
                                                    `s${displayId}`
                                                ]

                                                    ? credential.password

                                                    : "••••••••••"}

                                            </td>


                                            {/* PERMISSION */}

                                            <td>

                                                {permissionValue === "EDIT" ? (

                                                    <strong
                                                        style={{
                                                            color: "green"
                                                        }}
                                                    >

                                                        ✏ EDIT

                                                    </strong>

                                                ) : (

                                                    <strong
                                                        style={{
                                                            color: "#555"
                                                        }}
                                                    >

                                                        👁 VIEW

                                                    </strong>

                                                )}

                                            </td>


                                            {/* ACTIONS */}

                                            <td className="action-buttons">


                                                {/* SHOW */}

                                                <button

                                                    className="show-btn"

                                                    onClick={() =>
                                                        setShowPassword({

                                                            ...showPassword,

                                                            [`s${displayId}`]:
                                                                !showPassword[
                                                                    `s${displayId}`
                                                                ],

                                                        })
                                                    }

                                                >

                                                    {showPassword[
                                                        `s${displayId}`
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


                                                {/* EDIT ONLY FOR EDIT PERMISSION */}

                                                {permissionValue === "EDIT" && (

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

                )}


                {/* BACK */}

                <Link
                    className="back-btn"
                    to="/dashboard"
                >

                    ← Back to Dashboard

                </Link>


            </div>


            {/* ===================================================== */}
            {/* SHARE CREDENTIAL MODAL */}
            {/* ===================================================== */}

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


                        {/* EMAIL */}

                        <label>
                            Recipient Email
                        </label>


                        <input

                            type="email"

                            placeholder="Enter registered user's email"

                            value={sharedWithEmail}

                            onChange={(e) =>
                                setSharedWithEmail(
                                    e.target.value
                                )
                            }

                            autoFocus

                        />


                        {/* PERMISSION */}

                        <label>
                            Permission
                        </label>


                        <select

                            value={permission}

                            onChange={(e) =>
                                setPermission(
                                    e.target.value
                                )
                            }

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

                                onClick={
                                    closeShareModal
                                }

                            >

                                Cancel

                            </button>


                            <button

                                type="button"

                                className="share-submit-btn"

                                onClick={
                                    submitShare
                                }

                            >

                                🔗 Share Credential

                            </button>


                        </div>


                    </div>

                </div>

            )}

        </div>

    );

}


export default Vault;