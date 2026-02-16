import apiClient from '../api/apiClient';

export const pomodoroService = {
    getSessions: async () => {
        const response = await apiClient.get('/pomodoro');
        return response.data;
    },
    createSession: async (sessionData) => {
        const response = await apiClient.post('/pomodoro', sessionData);
        return response.data;
    }
};
