import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5003/api/v1", 
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include JWT token
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

// Add a response interceptor to handle auth errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error(`❌ API Error [${error.response.status}]:`, error.response.data);
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } else if (error.request) {
            console.error("❌ Network Error: No response received from server.");
            console.error("🔍 URL Failed:", error.config?.url);
        } else {
            console.error("❌ Request Setup Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;