import apiClient from '../api/apiClient';

export const timetableService = {
    getTimetable: async () => {
        const response = await apiClient.get('/timetable');
        return response.data;
    },
    updateSchedule: async (schedule) => {
        const response = await apiClient.post('/timetable/schedule', { schedule });
        return response.data;
    },
    clearTimetable: async () => {
        const response = await apiClient.delete('/timetable');
        return response.data;
    }
};
