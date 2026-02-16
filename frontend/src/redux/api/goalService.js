import apiClient from '../api/apiClient';

export const goalService = {
    getGoals: async () => {
        const response = await apiClient.get('/goals');
        return response.data;
    },
    createGoal: async (goalData) => {
        const response = await apiClient.post('/goals', goalData);
        return response.data;
    },
    updateGoal: async (goalId, goalData) => {
        const response = await apiClient.put(`/goals/${goalId}`, goalData);
        return response.data;
    },
    deleteGoal: async (goalId) => {
        const response = await apiClient.delete(`/goals/${goalId}`);
        return response.data;
    },
};
