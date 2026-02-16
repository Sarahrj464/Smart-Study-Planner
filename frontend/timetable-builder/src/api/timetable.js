import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const listTimetables = () => client.get('/api/timetable').then((r) => r.data);
export const createTimetable = (payload) => client.post('/api/timetable', payload).then((r) => r.data);
export const getTimetable = (id) => client.get(`/api/timetable/${id}`).then((r) => r.data);
export const updateTimetable = (id, payload) => client.put(`/api/timetable/${id}`, payload).then((r) => r.data);
export const deleteTimetable = (id) => client.delete(`/api/timetable/${id}`).then((r) => r.data);