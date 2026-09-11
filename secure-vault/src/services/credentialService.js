import axios from "axios";
import { API_URL } from "../config";

// =====================================================
// API URL
// =====================================================

const API = `${API_URL}/api/credentials`;

// =====================================================
// HELPER - GET LOGGED IN USER EMAIL
// =====================================================

const getUserEmail = () => {

    const email = localStorage.getItem("userEmail");

    if (!email) {
        throw new Error(
            "User session not found. Please login again."
        );
    }

    return email;
};


// =====================================================
// ADD CREDENTIAL
// =====================================================

export const addCredential = (credential) => {

    const email = getUserEmail();

    const data = {
        website: credential.website,
        username: credential.username,
        password: credential.password,
        email: email
    };

    return axios.post(
        API,
        data
    );
};


// =====================================================
// GET MY CREDENTIALS
// =====================================================

export const getCredentials = () => {

    const email = getUserEmail();

    return axios.get(
        `${API}?email=${encodeURIComponent(email)}`
    );
};


// =====================================================
// GET SHARED CREDENTIALS
// =====================================================

export const getSharedCredentials = () => {

    const email = getUserEmail();

    return axios.get(
        `${API}/shared?email=${encodeURIComponent(email)}`
    );
};


// =====================================================
// GET CREDENTIAL BY ID
// =====================================================

export const getCredentialById = (id) => {

    return axios.get(
        `${API}/${id}`
    );
};


// =====================================================
// UPDATE CREDENTIAL
// =====================================================

export const updateCredential = (
    id,
    credential
) => {

    const email = getUserEmail();

    const data = {
        website: credential.website,
        username: credential.username,
        password: credential.password
    };

    return axios.put(
        `${API}/${id}?email=${encodeURIComponent(email)}`,
        data
    );
};


// =====================================================
// DELETE CREDENTIAL
// =====================================================

export const deleteCredential = (id) => {

    const email = getUserEmail();

    return axios.delete(
        `${API}/${id}?email=${encodeURIComponent(email)}`
    );
};