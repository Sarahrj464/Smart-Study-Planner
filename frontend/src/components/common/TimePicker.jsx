import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, X, Keyboard } from 'lucide-react';

const TimePicker = ({ value, onChange, onClose }) => {
    // Parse initial time or default to current time
    const [hours, setHours] = useState(12);
    const [minutes, setMinutes] = useState(0);
    const [period, setPeriod] = useState('AM');
    const [mode, setMode] = useState('hours'); // 'hours' or 'minutes'

    useEffect(() => {
        if (value) {
            const [timePart, periodPart] = value.split(' ');
            if (timePart) {
                const [h, m] = timePart.split(':').map(Number);
                setHours(h);
                setMinutes(m);
                if (periodPart) setPeriod(periodPart);
            }
        } else {
            const now = new Date();
            let h = now.getHours();
            const m = now.getMinutes();
            const p = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            setHours(h);
            setMinutes(m);
            setPeriod(p);
        }
    }, [value]);

    const handleSave = () => {
        const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
        onChange(formattedTime);
        onClose();
    };

    const getRotation = (val, max) => {
        return (val / max) * 360;
    };

    const handleClockClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        // Calculate angle (0 is at 3 o'clock, so we subtract 90 deg to make 0 be 12 o'clock)
        let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
        if (angle < 0) angle += 360;

        if (mode === 'hours') {
            let h = Math.round(angle / 30);
            if (h === 0) h = 12;
            setHours(h);
            // Auto switch to minutes after selecting hour
            setTimeout(() => setMode('minutes'), 300);
        } else {
            let m = Math.round(angle / 6);
            if (m === 60) m = 0;
            setMinutes(m);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6">
                        <h3 className="text-slate-500 font-medium mb-6">Select time</h3>

                        {/* Digital Display */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <button
                                onClick={() => setMode('hours')}
                                className={`text-6xl font-display font-medium rounded-xl p-2 transition-colors ${mode === 'hours' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            >
                                {hours}
                            </button>
                            <span className="text-6xl font-display font-medium text-slate-300">:</span>
                            <button
                                onClick={() => setMode('minutes')}
                                className={`text-6xl font-display font-medium rounded-xl p-2 transition-colors ${mode === 'minutes' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            >
                                {minutes.toString().padStart(2, '0')}
                            </button>

                            <div className="flex flex-col gap-2 ml-4">
                                <button
                                    onClick={() => setPeriod('AM')}
                                    className={`px-3 py-1 rounded-lg text-sm font-bold border ${period === 'AM' ? 'bg-blue-100 text-blue-600 border-blue-200' : 'text-slate-500 border-slate-200'}`}
                                >
                                    AM
                                </button>
                                <button
                                    onClick={() => setPeriod('PM')}
                                    className={`px-3 py-1 rounded-lg text-sm font-bold border ${period === 'PM' ? 'bg-blue-100 text-blue-600 border-blue-200' : 'text-slate-500 border-slate-200'}`}
                                >
                                    PM
                                </button>
                            </div>
                        </div>

                        {/* Analog Clock Face */}
                        <div className="relative w-64 h-64 mx-auto mb-6 select-none">
                            <div
                                className="absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-700 cursor-pointer"
                                onClick={handleClockClick}
                            >
                                {/* Center Dot */}
                                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20" />

                                {/* Clock Numbers */}
                                {[...Array(12)].map((_, i) => {
                                    const val = i + 1;
                                    const rotation = val * 30; // 360 / 12
                                    const angleRad = (rotation - 90) * (Math.PI / 180);
                                    const radius = 100; // Radius for numbers
                                    const x = 128 + radius * Math.cos(angleRad); // 128 is half of w-64 (256px)
                                    const y = 128 + radius * Math.sin(angleRad);

                                    const isSelected = mode === 'hours' ? hours === val : (val * 5) % 60 === minutes;

                                    return (
                                        <div
                                            key={val}
                                            className={`absolute flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors transform -translate-x-1/2 -translate-y-1/2 ${isSelected ? 'bg-blue-500 text-white z-20' : 'text-slate-400'}`}
                                            style={{ left: x, top: y }}
                                        >
                                            {mode === 'hours' ? val : (val * 5 === 60 ? '00' : val * 5)}
                                        </div>
                                    );
                                })}

                                {/* Clock Hand */}
                                <div
                                    className="absolute top-1/2 left-1/2 h-1 bg-blue-500 origin-left z-10 rounded-full pointer-events-none transition-transform duration-300"
                                    style={{
                                        width: '100px',
                                        transform: `translateY(-50%) rotate(${(mode === 'hours' ? getRotation(hours, 12) : getRotation(minutes, 60)) - 90}deg)`
                                    }}
                                >
                                    <div className="absolute right-0 top-1/2 w-8 h-8 bg-blue-500 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-20" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                <Keyboard size={24} />
                            </button>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 text-blue-600 font-bold hover:bg-blue-50 rounded-xl transition-colors"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TimePicker;
