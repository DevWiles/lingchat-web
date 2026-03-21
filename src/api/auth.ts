import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

// 创建 axios 实例
const apiClient = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
});

// 请求拦截器：自动添加 token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器：处理 401 错误
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // token 过期或无效，清除 token
            localStorage.removeItem('token');
            // 不再自动跳转，由页面组件自行处理
        }
        return Promise.reject(error);
    }
);

export const register = async (username: string, password: string) => {
    return apiClient.post('/auth/register', { username, password });
};

export const login = async (username: string, password: string) => {
    return apiClient.post('/auth/login', { username, password });
};

export { apiClient };
