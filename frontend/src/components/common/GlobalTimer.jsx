import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tick, incrementCompletedSessions, addSession, setTimerActive } from '../../redux/slices/pomodoroSlice';
import { pomodoroService } from '../../redux/api/pomodoroService';
import { updateUser } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const GlobalTimer = () => {
    const dispatch = useDispatch();
    const { timeLeft, isActive, mode } = useSelector((state) => state.pomodoro);
    const { user } = useSelector((state) => state.auth);

    const MOTIVATIONAL_MESSAGES = [
        "Legendary work! You crushed that session! 🏆",
        "Focus levels: ELITE. Time for a well-deserved break! ⚡",
        "Boom! Another session focused. You're unstoppable! 🔥",
        "Success is the sum of small efforts. Great job! ✨",
        "One step closer to your goals. Excellent focus! 🎯",
        "Your brain worked hard. Let it recharge now! 🔋"
    ];

    const handleComplete = useCallback(async () => {
        dispatch(setTimerActive(false));

        if (mode === 'focus') {
            try {
                // Determine duration based on current state (default 25)
                const sessionDuration = 25;
                const res = await pomodoroService.createSession({
                    duration: sessionDuration,
                    completed: true
                });

                dispatch(addSession(res.data));
                dispatch(incrementCompletedSessions());

                const randomMessage = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];

                toast.success(randomMessage, {
                    duration: 6000,
                    icon: '🚀',
                    position: 'bottom-right',
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        borderRadius: '16px',
                        padding: '16px',
                        fontWeight: 'bold'
                    }
                });

                // Auto-transition to Short Break
                setTimeout(() => {
                    dispatch(setMode({ mode: 'short', time: 5 * 60 }));
                    toast('Ready for a 5-minute break?', {
                        icon: '☕',
                        duration: 8000,
                        position: 'bottom-right'
                    });
                }, 1500);

                // Refresh user metrics globally
                if (user) {
                    const updatedUser = {
                        ...user,
                        xp: (user.xp || 0) + 10,
                        studyStats: {
                            ...user.studyStats,
                            totalHours: (user.studyStats?.totalHours || 0) + (sessionDuration / 60)
                        }
                    };
                    dispatch(updateUser(updatedUser));
                }
            } catch (err) {
                console.error('Failed to save session:', err);
            }
        } else {
            toast.success('Break finished! Ready to focus? 🧠', {
                duration: 5000,
                position: 'bottom-right'
            });
            // Auto-transition back to Focus mode but don't start it
            dispatch(setMode({ mode: 'focus', time: 25 * 60 }));
        }

        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => { });
    }, [mode, dispatch, user]);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                dispatch(tick());
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            handleComplete();
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, dispatch, handleComplete]);

    return null; // This component doesn't render anything
};

export default GlobalTimer;
