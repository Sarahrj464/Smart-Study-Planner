import apiClient from '../api/apiClient';

export const authService = {
    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    },
    signup: async (userData) => {
        const response = await apiClient.post('/auth/signup', userData);
        return response.data;
    },
    logout: async () => {
        const response = await apiClient.get('/auth/logout');
        return response.data;
    },
    getCurrentUser: async (token) => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },
    updateDetails: async (userData) => {
        const response = await apiClient.put('/auth/updatedetails', userData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};
