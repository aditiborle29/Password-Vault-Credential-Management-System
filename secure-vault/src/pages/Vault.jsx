import React, { useEffect, useState } from "react";
import { getCredentials } from "../services/credentialService";
import { Link } from "react-router-dom";
import "./Vault.css";

function Vault() {
  const [credentials, setCredentials] = useState([]);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    const response = await getCredentials();
    setCredentials(response.data);
  };

  return (
    <div className="vault-container">

      <div className="vault-card">

        <h2>🔐 Saved Credentials</h2>

        <table>

          <thead>
            <tr>
              <th>Website</th>
              <th>Username</th>
              <th>Password</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {credentials.length === 0 ? (

              <tr>
                <td colSpan="4">No Credentials Found</td>
              </tr>

            ) : (

              credentials.map((credential) => (

                <tr key={credential.id}>
                  <td>{credential.website}</td>
                  <td>{credential.username}</td>
                  <td>{credential.password}</td>

                  <td>
                    <Link
                      className="edit-btn"
                      to={`/edit/${credential.id}`}
                    >
                      ✏ Edit
                    </Link>
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Vault;