import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCredentialById,
  updateCredential,
} from "../services/credentialService";
import "./EditCredential.css";

function EditCredential() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadCredential();
  }, []);

  const loadCredential = async () => {
    try {
      const response = await getCredentialById(id);

      setWebsite(response.data.website);
      setUsername(response.data.username);
      setPassword(response.data.password);
    } catch (error) {
      alert("Unable to load credential");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateCredential(id, {
        website,
        username,
        password,
      });

      alert("Credential Updated Successfully");
      navigate("/vault");
    } catch (error) {
      alert("Update Failed");
    }
  };

  return (
    <div className="edit-container">
      <div className="edit-card">

        <h2>✏ Edit Credential</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Update Credential
          </button>

        </form>

      </div>
    </div>
  );
}

export default EditCredential;