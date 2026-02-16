import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pomodoroReducer from './slices/pomodoroSlice';
import timetableReducer from './slices/timetableSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        pomodoro: pomodoroReducer,
        timetable: timetableReducer,
        theme: themeReducer,
    },
});
