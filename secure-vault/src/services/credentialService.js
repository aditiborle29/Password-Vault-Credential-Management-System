import axios from "axios";

const API = "http://localhost:8080/api/credentials";

export const getCredentials = () => axios.get(API);

export const addCredential = (credential) =>
  axios.post(API, credential);

export const getCredentialById = (id) =>
  axios.get(`${API}/${id}`);

export const updateCredential = (id, credential) =>
  axios.put(`${API}/${id}`, credential);