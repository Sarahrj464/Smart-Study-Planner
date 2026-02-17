// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';
// import pomodoroReducer from './slices/pomodoroSlice';
// import timetableReducer from './slices/timetableSlice';
// import themeReducer from './slices/themeSlice';

// export const store = configureStore({
//     reducer: {
//         auth: authReducer,
//         pomodoro: pomodoroReducer,
//         timetable: timetableReducer,
//         theme: themeReducer,
//     },
// });

// frontend/src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pomodoroReducer from './slices/pomodoroSlice';
import taskReducer from './slices/taskSlice';
import themeReducer from './slices/themeSlice';
import timetableReducer from './slices/timetableSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pomodoro: pomodoroReducer,
    tasks: taskReducer,  // ⭐ NEW
    theme: themeReducer,
    timetable: timetableReducer,
  },
});

export default store;