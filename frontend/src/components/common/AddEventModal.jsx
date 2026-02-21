import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, Tag, Type, Save } from 'lucide-react';
import { useState } from 'react';

const AddEventModal = ({ isOpen, onClose, onSave, initialDate }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('study');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [priority, setPriority] = useState('medium');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        // Create date objects based on initialDate and selected times
        const start = new Date(initialDate);
        const [sH, sM] = startTime.split(':');
        start.setHours(parseInt(sH), parseInt(sM));

        const end = new Date(initialDate);
        const [eH, eM] = endTime.split(':');
        end.setHours(parseInt(eH), parseInt(eM));

        onSave({ title, type, start, end, priority });
        setTitle('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white flex items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
                        <div className="flex items-center gap-4 relative z-10">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner"
                            >
                                <CalendarIcon size={24} />
                            </motion.div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Add New Event</h2>
                                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest opacity-80 mt-0.5">Academic Planner</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all hover:rotate-90 relative z-10">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Type size={14} /> Event Name
                            </label>
                            <input
                                autoFocus
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Physics Revision"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                            />
                        </div>

                        {/* Type Selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Tag size={14} /> Type
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {['study', 'exam', 'deadline'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setType(t)}
                                        className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${type === t
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Clock size={14} /> Start
                                </label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Clock size={14} /> End
                                </label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                                />
                            </div>
                        </div>

                        {/* Priority Selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                Priority
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { val: 'low', color: 'emerald' },
                                    { val: 'medium', color: 'blue' },
                                    { val: 'high', color: 'rose' }
                                ].map((p) => (
                                    <button
                                        key={p.val}
                                        type="button"
                                        onClick={() => setPriority(p.val)}
                                        className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${priority === p.val
                                            ? `bg-${p.color}-600 text-white border-${p.color}-600 shadow-lg`
                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:border-slate-300'
                                            }`}
                                    >
                                        {p.val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 px-4 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                Save
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddEventModal;
