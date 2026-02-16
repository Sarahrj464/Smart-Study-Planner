import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sessions: [],
    currentSession: null,
    loading: false,
    // Timer State
    timeLeft: 25 * 60,
    isActive: false,
    mode: 'focus', // 'focus', 'short', 'long'
    completedSessions: 0,
};

const pomodoroSlice = createSlice({
    name: 'pomodoro',
    initialState,
    reducers: {
        setSessions: (state, action) => {
            state.sessions = action.payload;
        },
        addSession: (state, action) => {
            state.sessions.unshift(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        // Timer Reducers
        updateTime: (state, action) => {
            state.timeLeft = action.payload;
        },
        tick: (state) => {
            if (state.isActive && state.timeLeft > 0) {
                state.timeLeft -= 1;
            }
        },
        toggleTimer: (state) => {
            state.isActive = !state.isActive;
        },
        setTimerActive: (state, action) => {
            state.isActive = action.payload;
        },
        resetTimer: (state, action) => {
            state.isActive = false;
            state.timeLeft = action.payload; // Duration for current mode
        },
        setMode: (state, action) => {
            state.mode = action.payload.mode;
            state.timeLeft = action.payload.time;
            // Don't stop the timer - let it continue running when switching modes
        },
        incrementCompletedSessions: (state) => {
            state.completedSessions += 1;
        }
    },
});

export const {
    setSessions,
    addSession,
    setLoading,
    updateTime,
    tick,
    toggleTimer,
    setTimerActive,
    resetTimer,
    setMode,
    incrementCompletedSessions
} = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
