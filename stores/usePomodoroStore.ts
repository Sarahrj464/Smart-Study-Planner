import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PomodoroState {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  sessions: Array<{ id: string; duration_minutes: number; created_at: string }>;
  settings: { workDuration: number; breakDuration: number };
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  completeSession: () => Promise<void>;
  setSessions: (sessions: Array<{ id: string; duration_minutes: number; created_at: string }>) => void;
  updateSettings: (settings: Partial<PomodoroState["settings"]>) => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      timeLeft: 25 * 60,
      isRunning: false,
      isPaused: false,
      sessions: [],
      settings: { workDuration: 25, breakDuration: 5 },

      startTimer: () => set({ isRunning: true, isPaused: false }),
      pauseTimer: () => set({ isPaused: true, isRunning: false }),
      resetTimer: () =>
        set({
          timeLeft: get().settings.workDuration * 60,
          isRunning: false,
          isPaused: false,
        }),

      tick: () => {
        const { timeLeft, isRunning } = get();
        if (!isRunning || timeLeft <= 0) return;
        if (timeLeft === 1) {
          get().completeSession();
          return;
        }
        set({ timeLeft: timeLeft - 1 });
      },

      completeSession: async () => {
        const { settings } = get();
        const res = await fetch("/api/pomodoro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            duration_minutes: settings.workDuration,
            break_duration_minutes: settings.breakDuration,
            completed: true,
          }),
        });
        if (res.ok) {
          set({
            timeLeft: settings.workDuration * 60,
            isRunning: false,
          });
        }
      },

      setSessions: (sessions) => set({ sessions }),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
          timeLeft: (newSettings.workDuration ?? state.settings.workDuration) * 60,
        })),
    }),
    { name: "pomodoro-storage", partialize: (state) => ({ settings: state.settings }) }
  )
);
