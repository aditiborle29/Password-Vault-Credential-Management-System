import React, { useState } from "react";
import { addCredential } from "../services/credentialService";
import { useNavigate } from "react-router-dom";

function AddCredential() {

    const navigate = useNavigate();

    const [website, setWebsite] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await addCredential({
                website,
                username,
                password
            });

            alert("Credential Saved Successfully");

            navigate("/vault");

        } catch (error) {

            alert("Failed to Save Credential");

        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "80px" }}>

            <h2>Add Credential</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                />

                <br /><br />

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br /><br />

                <button type="submit">
                    Save Credential
                </button>

            </form>

        </div>
    );
}

export default AddCredential;