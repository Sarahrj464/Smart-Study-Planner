import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { timetableService } from '../redux/api/timetableService';
import { setTimetable } from '../redux/slices/timetableSlice';
import { Plus, Trash2, Save, X, Calendar as CalIcon, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import AddEventModal from '../components/common/AddEventModal';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMES = Array.from({ length: 14 }, (_, i) => `${i + 8}:00`); // 8:00 to 21:00

const TimetablePage = () => {
    const dispatch = useDispatch();
    const { schedule } = useSelector((state) => state.timetable);
    const [localSchedule, setLocalSchedule] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState({ day: '', time: '' });

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const res = await timetableService.getTimetable();
                dispatch(setTimetable(res.data.schedule));
                setLocalSchedule(res.data.schedule);
            } catch (err) {
                toast.error('Failed to load timetable');
            }
        };
        fetchTimetable();
    }, [dispatch]);

    const getEventForSlot = (day, time) => {
        return localSchedule.find(item => item.day === day && item.timeSlot.startsWith(time));
    };

    const handleOpenModal = (day, time) => {
        setSelectedSlot({ day, time });
        setIsModalOpen(true);
    };

    const handleSaveEvent = (eventData) => {
        const newItem = {
            day: selectedSlot.day,
            timeSlot: `${eventData.start.getHours()}:00 - ${eventData.end.getHours()}:00`,
            subject: eventData.title,
            type: eventData.type
        };
        setLocalSchedule([...localSchedule, newItem]);
        toast.success(`${eventData.title} added to ${selectedSlot.day}`);
    };

    const removeEvent = (itemToRemove) => {
        setLocalSchedule(localSchedule.filter(item => item !== itemToRemove));
    };

    const saveTimetable = async () => {
        setIsSaving(true);
        try {
            const res = await timetableService.updateSchedule(localSchedule);
            dispatch(setTimetable(res.data.schedule));
            toast.success('Timetable saved successfully!');
        } catch (err) {
            toast.error('Failed to save timetable');
        } finally {
            setIsSaving(false);
        }
    };

    const clearAll = async () => {
        if (!window.confirm('Clear typical week schedule?')) return;
        try {
            await timetableService.clearTimetable();
            setLocalSchedule([]);
            dispatch(setTimetable([]));
            toast.success('Timetable cleared');
        } catch (err) {
            toast.error('Failed to clear');
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700 h-[calc(100vh-8rem)] flex flex-col pb-6">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        Weekly <span className="text-blue-600">Timetable</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold">
                        Plan your recurring academic week for maximum productivity.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={clearAll}
                        className="px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        Clear Week
                    </button>
                    <button
                        onClick={saveTimetable}
                        disabled={isSaving}
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        <Save size={20} />
                        {isSaving ? 'Saving...' : 'Save Schedule'}
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-hidden bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl relative flex flex-col">
                {/* Scrollable Container */}
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <div className="min-w-[1200px]">
                        {/* Header Row */}
                        <div className="grid grid-cols-8 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-30">
                            <div className="p-6 border-r border-slate-100 dark:border-slate-800 font-black text-center text-slate-400 text-xs uppercase tracking-widest">Time</div>
                            {DAYS.map(day => (
                                <div key={day} className="p-6 border-r border-slate-100 dark:border-slate-800 font-black text-center text-slate-800 dark:text-white text-sm uppercase tracking-wider last:border-r-0">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Timeslots */}
                        {TIMES.map(time => (
                            <div key={time} className="grid grid-cols-8 border-b border-slate-50 dark:border-slate-800/50 last:border-b-0 h-32">
                                {/* Time Label */}
                                <div className="p-4 border-r border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 flex flex-col items-center pt-6 space-y-1">
                                    <Clock size={14} className="opacity-50" />
                                    <span>{time}</span>
                                </div>

                                {/* Days */}
                                {DAYS.map(day => {
                                    const event = getEventForSlot(day, time);
                                    return (
                                        <div
                                            key={`${day}-${time}`}
                                            className="border-r border-slate-100 dark:border-slate-800 last:border-r-0 p-2 relative group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
                                        >
                                            {event ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className={`h-full w-full rounded-2xl border-l-[6px] p-4 flex flex-col justify-between shadow-lg relative group/event cursor-pointer hover:scale-[1.02] transition-all ${event.type === 'study' ? 'bg-purple-50 border-purple-500' : 'bg-blue-50 border-blue-500'
                                                        }`}
                                                >
                                                    <div>
                                                        <span className={`text-[9px] font-black uppercase tracking-widest ${event.type === 'study' ? 'text-purple-600' : 'text-blue-600'
                                                            }`}>
                                                            {event.type || 'Class'}
                                                        </span>
                                                        <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 mt-1 line-clamp-2">{event.subject}</h4>
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeEvent(event); }}
                                                        className="absolute top-2 right-2 opacity-0 group-hover/event:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <button
                                                    onClick={() => handleOpenModal(day, time)}
                                                    className="w-full h-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all gap-2"
                                                >
                                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 border border-blue-200 shadow-sm scale-75 group-hover:scale-100 transition-transform">
                                                        <Plus size={20} />
                                                    </div>
                                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Add Slot</span>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AddEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEvent}
                initialDate={new Date()} // Simplified for recurring timetable
            />
        </div>
    );
};

export default TimetablePage;

