import apiClient from '../api/apiClient';

export const taskService = {
    getTasks: async () => {
        const response = await apiClient.get('/tasks');
        return response.data;
    },
    createTask: async (taskData) => {
        // apiClient interceptors handle the token. 
        // We just need to handle FormData if present.
        const config = {};
        if (taskData instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }

        const response = await apiClient.post('/tasks', taskData, config);
        return response.data;
    },
    updateTask: async (taskId, taskData) => {
        const response = await apiClient.put(`/tasks/${taskId}`, taskData);
        return response.data;
    },
    deleteTask: async (taskId) => {
        const response = await apiClient.delete(`/tasks/${taskId}`);
        return response.data;
    },
};
