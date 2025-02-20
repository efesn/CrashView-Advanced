import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: 'https://localhost:7237/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance; 