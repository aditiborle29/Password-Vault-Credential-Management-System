import React, { useEffect, useState } from "react";
import {
  getCredentials,
  deleteCredential,
} from "../services/credentialService";
import { Link } from "react-router-dom";
import "./Vault.css";

function Vault() {
  const [credentials, setCredentials] = useState([]);
  const [showPassword, setShowPassword] = useState({});

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const response = await getCredentials();
      setCredentials(response.data);
    } catch (error) {
      alert("Failed to load credentials");
    }
  };

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
      alert("Failed to delete credential");
    }
  };

  const copyPassword = (password) => {
    navigator.clipboard.writeText(password);
    alert("Password Copied Successfully!");
  };

  return (
    <div className="vault-container">
      <div className="vault-card">

        <h2>🔐 My Saved Credentials</h2>

        {credentials.length === 0 ? (
          <p className="no-data">No credentials found.</p>
        ) : (
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
              {credentials.map((credential) => (
                <tr key={credential.id}>
                  <td>{credential.website}</td>
                  <td>{credential.username}</td>

                  <td>
                    {showPassword[credential.id]
                      ? credential.password
                      : "••••••••••"}
                  </td>

                  <td className="action-buttons">

                    <button
                      className="show-btn"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          [credential.id]:
                            !showPassword[credential.id],
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
                        copyPassword(credential.password)
                      }
                    >
                      📋 Copy
                    </button>

                    <Link
                      className="edit-btn"
                      to={`/edit/${credential.id}`}
                    >
                      ✏ Edit
                    </Link>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(credential.id)
                      }
                    >
                      🗑 Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Link className="back-btn" to="/dashboard">
          ← Back to Dashboard
        </Link>

      </div>
    </div>
  );
}

export default Vault;