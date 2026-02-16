import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    schedule: [],
    loading: false,
};

const timetableSlice = createSlice({
    name: 'timetable',
    initialState,
    reducers: {
        setTimetable: (state, action) => {
            state.schedule = action.payload;
        },
        updateSchedule: (state, action) => {
            state.schedule = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
});

export const { setTimetable, updateSchedule, setLoading } = timetableSlice.actions;
export default timetableSlice.reducer;
