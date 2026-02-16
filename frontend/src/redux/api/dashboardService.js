import apiClient from '../api/apiClient';

export const dashboardService = {
    getStats: async (retries = 3, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await apiClient.get('/dashboard');
                return response.data;
            } catch (err) {
                if (i === retries - 1) throw err;
                console.warn(`Dashboard fetch attempt ${i + 1} failed, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }
};
