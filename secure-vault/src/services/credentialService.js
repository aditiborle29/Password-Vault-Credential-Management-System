import axios from "axios";

const API = "http://localhost:8080/api/credentials";

// ================= GET MY CREDENTIALS =================

export const getCredentials = () => {
  const email = localStorage.getItem("userEmail");

  return axios.get(API, {
    params: {
      email: email,
    },
  });
};


// ================= ADD CREDENTIAL =================

export const addCredential = (credential) => {
  const email = localStorage.getItem("userEmail");

  return axios.post(API, {
    ...credential,
    email: email,
  });
};


// ================= GET CREDENTIAL BY ID =================

export const getCredentialById = (id) => {
  return axios.get(`${API}/${id}`);
};


// ================= UPDATE CREDENTIAL =================

export const updateCredential = (id, credential) => {
  const email = localStorage.getItem("userEmail");

  return axios.put(
    `${API}/${id}`,
    credential,
    {
      params: {
        email: email,
      },
    }
  );
};


// ================= DELETE CREDENTIAL =================

export const deleteCredential = (id) => {
  const email = localStorage.getItem("userEmail");

  return axios.delete(
    `${API}/${id}`,
    {
      params: {
        email: email,
      },
    }
  );
};


// ================= GET SHARED CREDENTIALS =================

export const getSharedCredentials = () => {
  const email = localStorage.getItem("userEmail");

  return axios.get(`${API}/shared`, {
    params: {
      email: email,
    },
  });
};