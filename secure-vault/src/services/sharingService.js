import axios from "axios";

const API = "http://localhost:8080/api/sharing";

// ================= SHARE CREDENTIAL =================

export const shareCredential = (data) => {
    return axios.post(API, data);
};

// ================= GET SHARED CREDENTIALS =================

export const getSharedCredentials = () => {

    const email = localStorage.getItem("userEmail");

    return axios.get(`${API}/shared`, {
        params: {
            email: email
        }
    });
};

// ================= GET SHARED CREDENTIAL BY ID =================

export const getSharedCredentialById = (id) => {

    return axios.get(`${API}/${id}`);
};

// ================= REMOVE SHARING =================

export const removeSharedCredential = (id) => {

    return axios.delete(`${API}/${id}`);
};