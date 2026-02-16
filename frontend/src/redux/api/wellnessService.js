import apiClient from '../api/apiClient';

export const wellnessService = {
    getLogs: async () => {
        const response = await apiClient.get('/wellness');
        return response.data;
    },
    createLog: async (logData) => {
        const response = await apiClient.post('/wellness', logData);
        return response.data;
    },
    deleteLog: async (id) => {
        const response = await apiClient.delete(`/wellness/${id}`);
        return response.data;
    }
};
