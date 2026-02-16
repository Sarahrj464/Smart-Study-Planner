import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pomodoroService } from '../redux/api/pomodoroService';
import { addSession, toggleTimer, setMode, resetTimer } from '../redux/slices/pomodoroSlice';
import { updateUser } from '../redux/slices/authSlice';
import { Play, Pause, RotateCcw, Coffee, Brain, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

const PomodoroPage = () => {
    const dispatch = useDispatch();
    const { timeLeft, isActive, mode, completedSessions } = useSelector((state) => state.pomodoro);

    const MODES = {
        focus: { label: 'Focus Time', time: 25 * 60, color: 'text-blue-600', bg: 'bg-blue-600' },
        short: { label: 'Short Break', time: 5 * 60, color: 'text-emerald-500', bg: 'bg-emerald-500' },
        long: { label: 'Long Break', time: 15 * 60, color: 'text-indigo-500', bg: 'bg-indigo-500' }
    };

    const toggleTimerHandler = () => dispatch(toggleTimer());

    const resetTimerHandler = () => {
        dispatch(resetTimer(MODES[mode].time));
    };

    const changeModeHandler = (newMode) => {
        dispatch(setMode({ mode: newMode, time: MODES[newMode].time }));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-black tracking-tight">{MODES[mode].label}</h1>
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <ModeButton
                        active={mode === 'focus'}
                        onClick={() => changeModeHandler('focus')}
                        icon={<Brain size={18} />}
                        label="Focus"
                    />
                    <ModeButton
                        active={mode === 'short'}
                        onClick={() => changeModeHandler('short')}
                        icon={<Coffee size={18} />}
                        label="Short Break"
                    />
                    <ModeButton
                        active={mode === 'long'}
                        onClick={() => changeModeHandler('long')}
                        icon={<RotateCcw size={18} />}
                        label="Long Break"
                    />
                </div>
            </div>

            <div className="relative group">
                {/* Progress Ring Background */}
                <div className="w-80 h-80 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-xl bg-white dark:bg-slate-900 transition-colors">
                    <div className="text-center">
                        <span className={`text-7xl font-mono font-black tabular-nums transition-colors ${MODES[mode].color}`}>
                            {formatTime(timeLeft)}
                        </span>
                        <div className="flex items-center justify-center gap-1 text-slate-400 mt-2 font-medium">
                            <Trophy size={14} />
                            <span className="text-xs uppercase tracking-wider">{completedSessions} Sessions today</span>
                        </div>
                    </div>
                </div>

                {/* Controls Overlay (Bottom) */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                    <button
                        onClick={toggleTimerHandler}
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 active:scale-95 ${MODES[mode].bg}`}
                    >
                        {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                    </button>
                    <button
                        onClick={resetTimerHandler}
                        className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-md transition-all hover:rotate-180"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>

            <div className="max-w-md bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                <h3 className="font-bold mb-2">Did you know?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                    "The Pomodoro Technique was developed by Francesco Cirillo in the late 1980s. It uses a kitchen timer to break work into intervals, traditionally 25 minutes."
                </p>
            </div>
        </div>
    );
};

const ModeButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${active
            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default PomodoroPage;
