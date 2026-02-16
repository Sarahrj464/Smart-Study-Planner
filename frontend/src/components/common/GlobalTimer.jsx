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

    const handleComplete = useCallback(async () => {
        dispatch(setTimerActive(false));

        if (mode === 'focus') {
            try {
                const res = await pomodoroService.createSession({
                    duration: 25,
                    completed: true
                });

                dispatch(addSession(res.data));
                dispatch(incrementCompletedSessions());
                toast.success('Session complete! +10 XP earned 🏆', {
                    duration: 5000,
                    position: 'bottom-right'
                });

                // Refresh user metrics globally
                if (user) {
                    const updatedUser = {
                        ...user,
                        xp: user.xp + 10,
                        studyStats: {
                            ...user.studyStats,
                            totalHours: (user.studyStats?.totalHours || 0) + (25 / 60)
                        }
                    };
                    dispatch(updateUser(updatedUser));
                }
            } catch (err) {
                console.error('Failed to save session:', err);
            }
        } else {
            toast.success('Break finished! Ready to focus?', {
                duration: 5000,
                position: 'bottom-right'
            });
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
