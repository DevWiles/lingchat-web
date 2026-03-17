import axios from 'axios';

const API_BASE = 'http://localhost:8080/api'; // 你的网关地址

export const register = async (username: string, password: string) => {
    return axios.post(`${API_BASE}/auth/register`, { username, password });
};

export const login = async (username: string, password: string) => {
    return axios.post(`${API_BASE}/auth/login`, { username, password });
};