import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSharedCredentials } from "../services/sharingService";
import "./Vault.css";

function SharedCredentials() {

    const [credentials, setCredentials] = useState([]);
    const [showPassword, setShowPassword] = useState({});

    useEffect(() => {
        loadSharedCredentials();
    }, []);

    const loadSharedCredentials = async () => {

        try {

            const response = await getSharedCredentials();

            console.log("SHARED CREDENTIALS:", response.data);

            setCredentials(response.data);

        } catch (error) {

            console.error("Shared credential error:", error);

            alert("Failed to load shared credentials");
        }
    };

    const copyPassword = (password) => {

        navigator.clipboard.writeText(password);

        alert("Password Copied Successfully!");
    };

    return (

        <div className="vault-container">

            <div className="vault-card">

                <h2>🔗 Shared With Me</h2>

                {credentials.length === 0 ? (

                    <p className="no-data">
                        No credentials have been shared with you.
                    </p>

                ) : (

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

                            {credentials.map((credential) => (

                                <tr key={credential.id}>

                                    <td>
                                        {credential.website}
                                    </td>

                                    <td>
                                        {credential.username}
                                    </td>

                                    <td>

                                        {showPassword[credential.id]
                                            ? credential.password
                                            : "••••••••••"}

                                    </td>

                                    <td>

                                        <strong>
                                            {credential.permission}
                                        </strong>

                                    </td>

                                    <td className="action-buttons">

                                        <button
                                            className="show-btn"
                                            onClick={() =>
                                                setShowPassword({
                                                    ...showPassword,
                                                    [credential.id]:
                                                        !showPassword[credential.id]
                                                })
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

                )}

                <Link
                    className="back-btn"
                    to="/dashboard"
                >

                    ← Back to Dashboard

                </Link>

            </div>

        </div>
    );
}

export default SharedCredentials;