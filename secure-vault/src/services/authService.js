import axios from "axios";
import { API_URL } from "../config";

const API = `${API_URL}/api/auth`;

export async function registerUser(user) {
    return axios.post(`${API}/register`, user);
}

export async function loginUser(user) {
    return axios.post(`${API}/login`, user);
}