import apiClient from '../api/apiClient';

export const roomService = {
    getRooms: async () => {
        const response = await apiClient.get('/rooms');
        return response.data;
    },
    createRoom: async (roomData) => {
        const response = await apiClient.post('/rooms', roomData);
        return response.data;
    },
    getRoom: async (id) => {
        const response = await apiClient.get(`/rooms/${id}`);
        return response.data;
    },
    deleteRoom: async (id) => {
        const response = await apiClient.delete(`/rooms/${id}`);
        return response.data;
    }
};
