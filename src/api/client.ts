import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:8008/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
client.interceptors.request.use(
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

// Add a response interceptor to handle errors
client.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors if needed, e.g., 401 Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Optionally redirect to login or clear user state
        }
        return Promise.reject(error);
    }
);

export default client;
