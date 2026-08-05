import axios from "axios";

const API = "http://localhost:8080/api/credentials";

// Get logged-in user's credentials
export const getCredentials = () => {
  const email = localStorage.getItem("userEmail");
  return axios.get(`${API}?email=${email}`);
};

// Add credential
export const addCredential = (credential) => {
  credential.email = localStorage.getItem("userEmail");
  return axios.post(API, credential);
};

// Get credential by ID
export const getCredentialById = (id) =>
  axios.get(`${API}/${id}`);

// Update credential
export const updateCredential = (id, credential) => {
  credential.email = localStorage.getItem("userEmail");
  return axios.put(`${API}/${id}`, credential);
};

// Delete credential
export const deleteCredential = (id) =>
  axios.delete(`${API}/${id}`);