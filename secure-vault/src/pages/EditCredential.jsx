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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);


  // ================= LOAD CREDENTIAL =================

  useEffect(() => {
    loadCredential();
  }, [id]);


  const loadCredential = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await getCredentialById(id);

      setWebsite(response.data.website || "");
      setUsername(response.data.username || "");
      setPassword(response.data.password || "");

    } catch (error) {

      console.error("Load credential error:", error);

      if (error.response) {

        if (error.response.status === 401) {
          setError("Your session has expired. Please login again.");
        }
        else if (error.response.status === 403) {
          setError("You are not authorized to view this credential.");
        }
        else if (error.response.status === 404) {
          setError("Credential not found.");
        }
        else {
          setError("Unable to load credential. Please try again.");
        }

      } else if (error.request) {

        setError(
          "Unable to connect to the server. Please make sure the backend is running."
        );

      } else {

        setError("Something went wrong. Please try again.");

      }

    } finally {

      setLoading(false);

    }
  };


  // ================= VALIDATION =================

  const validateForm = () => {

    if (!website.trim()) {
      return "Please enter a website.";
    }

    if (!username.trim()) {
      return "Please enter a username.";
    }

    if (!password.trim()) {
      return "Please enter a password.";
    }

    if (password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    return "";
  };


  // ================= UPDATE =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {

      setSaving(true);

      await updateCredential(id, {
        website: website.trim(),
        username: username.trim(),
        password: password,
      });

      setSuccess("Credential updated successfully!");

      setTimeout(() => {
        navigate("/vault");
      }, 800);

    } catch (error) {

      console.error("Update credential error:", error);

      if (error.response) {

        const status = error.response.status;

        if (status === 401) {

          setError(
            "Your session has expired. Please login again."
          );

        } else if (status === 403) {

          setError(
            "Access denied. You only have VIEW permission."
          );

        } else if (status === 404) {

          setError(
            "Credential not found."
          );

        } else if (status === 400) {

          setError(
            error.response.data?.message ||
            "Invalid credential information."
          );

        } else if (status === 500) {

          setError(
            "Server error. Please try again later."
          );

        } else {

          setError(
            error.response.data?.message ||
            "Unable to update credential."
          );

        }

      } else if (error.request) {

        setError(
          "Unable to connect to the server. Please check your connection."
        );

      } else {

        setError(
          "Something went wrong. Please try again."
        );

      }

    } finally {

      setSaving(false);

    }
  };


  // ================= LOADING =================

  if (loading) {

    return (
      <div className="edit-container">

        <div className="edit-card loading-card">

          <div className="loader"></div>

          <h2>Loading Credential...</h2>

          <p>Please wait.</p>

        </div>

      </div>
    );
  }


  // ================= UI =================

  return (

    <div className="edit-container">

      <div className="edit-card">

        <h2>✏️ Edit Credential</h2>

        <p className="edit-subtitle">
          Update your stored credential securely
        </p>


        {/* ERROR */}

        {error && (

          <div className="error-message">
            ⚠️ {error}
          </div>

        )}


        {/* SUCCESS */}

        {success && (

          <div className="success-message">
            ✅ {success}
          </div>

        )}


        <form onSubmit={handleSubmit}>

          {/* WEBSITE */}

          <div className="input-group">

            <label>Website</label>

            <input
              type="text"
              placeholder="e.g. www.google.com"
              value={website}
              onChange={(e) => {
                setWebsite(e.target.value);
                setError("");
              }}
              disabled={saving}
            />

          </div>


          {/* USERNAME */}

          <div className="input-group">

            <label>Username / Email</label>

            <input
              type="text"
              placeholder="Enter username or email"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              disabled={saving}
            />

          </div>


          {/* PASSWORD */}

          <div className="input-group">

            <label>Password</label>

            <div className="password-container">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={saving}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                disabled={saving}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>

            </div>

          </div>


          {/* UPDATE */}

          <button
            type="submit"
            className="update-btn"
            disabled={saving}
          >

            {saving
              ? "⏳ Updating..."
              : "✏️ Update Credential"}

          </button>


          {/* BACK */}

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/vault")}
            disabled={saving}
          >
            ← Back to Vault
          </button>

        </form>

      </div>

    </div>
  );
}

export default EditCredential;