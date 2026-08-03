import axios from "axios";

const API = "http://localhost:8080/api/auth";

export async function registerUser(user) {
    return axios.post(`${API}/register`, user);
}

export async function loginUser(user) {
    return axios.post(`${API}/login`, user);
}