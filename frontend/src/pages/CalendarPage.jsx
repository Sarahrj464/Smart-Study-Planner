import { useEffect, useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalIcon, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import AddEventModal from '../components/common/AddEventModal';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { taskService } from '../redux/api/taskService';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// Precise Custom Toolbar matching Image 2
const CustomToolbar = (toolbar) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    const label = () => {
        const date = toolbar.date;
        return format(date, 'd MMM, EEEE, yyyy');
    };

    return (
        <div className="flex items-center justify-between p-4 bg-[#e6f4fe] dark:bg-slate-900/80 rounded-t-[40px] border-b border-blue-100/50 dark:border-slate-800 transition-all">
            {/* Left Nav Pill */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 px-5 py-2.5 rounded-full shadow-sm border border-blue-50/50 dark:border-slate-700">
                <button onClick={goToBack} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-colors text-blue-400">
                    <ChevronLeft size={18} />
                </button>
                <span className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider min-w-[140px] text-center">
                    {label()}
                </span>
                <button onClick={goToNext} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-colors text-blue-400">
                    <ChevronRight size={18} />
                </button>
            </div>

            <div className="flex items-center gap-4">
                {/* View Switcher Pill */}
                <div className="flex items-center bg-[#f0f9ff]/50 dark:bg-slate-800/30 p-1.5 rounded-full border border-blue-100/30 dark:border-slate-800">
                    {['day', 'week', 'month'].map((v) => (
                        <button
                            key={v}
                            onClick={() => toolbar.onView(v)}
                            className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${toolbar.view === v
                                ? 'bg-[#0095ff] text-white shadow-lg shadow-blue-500/20'
                                : 'text-[#0095ff] hover:bg-white/50'
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>

                {/* Today Button */}
                <button
                    onClick={goToCurrent}
                    className="px-8 py-3 bg-white dark:bg-slate-800 border-2 border-blue-100 dark:border-blue-900 text-[#0095ff] font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm"
                >
                    Today
                </button>
            </div>
        </div>
    );
};

const CalendarPage = () => {
    const { token } = useSelector((state) => state.auth);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(new Date());

    const fetchTasks = async () => {
        try {
            const response = await taskService.getTasks(token);
            if (response.success) {
                const mappedEvents = response.data.map(task => {
                    // Combine dueDate and time for better calendar positioning
                    let start = new Date(task.dueDate);
                    if (task.time) {
                        try {
                            const [h, m] = task.time.split(':');
                            const hours = parseInt(h);
                            const minutes = parseInt(m.substring(0, 2));
                            const isPM = task.time.toLowerCase().includes('pm');

                            start.setHours(isPM && hours < 12 ? hours + 12 : (!isPM && hours === 12 ? 0 : hours));
                            start.setMinutes(minutes);
                        } catch (e) {
                            console.warn('Could not parse time for task:', task.title);
                        }
                    }

                    const duration = task.duration || 60; // default 1hr
                    const end = new Date(start.getTime() + duration * 60000);

                    return {
                        id: task._id,
                        title: task.title,
                        start,
                        end,
                        type: task.type.toUpperCase(),
                        completed: task.completed,
                        subject: task.subject,
                        mode: task.mode
                    };
                });
                setEvents(mappedEvents);
            }
        } catch (err) {
            console.error('Failed to fetch tasks for calendar:', err);
            toast.error('Failed to load calendar events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchTasks();
    }, [token]);

    const handleSelectSlot = ({ start }) => {
        setSelectedSlot(start);
        setIsModalOpen(true);
    };

    const handleSaveEvent = (newEvent) => {
        // Refresh after save
        fetchTasks();
        setIsModalOpen(false);
    };

    const eventStyleGetter = (event) => {
        return {
            className: 'transition-all hover:brightness-110 active:scale-[0.98]',
            style: {
                backgroundColor: 'transparent',
                border: '0px',
                padding: '0px',
                overflow: 'visible'
            },
        };
    };

    // Custom Event Component with Premium SaaS styling
    const CustomEvent = ({ event }) => {
        const typeColors = {
            'EXAM': 'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-400 font-black',
            'VACATION': 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400 font-black',
            'CLASS': 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400 font-black',
            'TASK': 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-400 font-black',
            'XTRA': 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400 font-black'
        };

        const config = typeColors[event.type] || typeColors['TASK'];

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`h-full w-full rounded-2xl border bg-gradient-to-br ${config.split(' ').slice(0, 2).join(' ')} ${config.split(' ')[2]} p-3 flex flex-col justify-between relative group overflow-hidden shadow-lg backdrop-blur-md transition-all`}
            >
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className={`text-[8px] uppercase tracking-widest ${config.split(' ')[3]}`}>
                            {event.type}
                        </span>
                        {event.completed && <Trophy size={10} className="text-emerald-400" />}
                    </div>
                    <h4 className="text-[11px] font-black text-white leading-tight truncate">
                        {event.title}
                    </h4>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className="text-[8px] font-bold text-slate-400 uppercase">
                        {event.subject || 'Misc'}
                    </span>
                    <span className="text-[8px] font-black text-white/50 group-hover:text-white transition-colors">
                        {format(event.start, 'p')}
                    </span>
                </div>

                {/* Glass Glow */}
                <div className="absolute -right-2 -top-2 w-8 h-8 bg-white/5 rounded-full blur-md group-hover:bg-white/10 transition-colors" />
            </motion.div>
        );
    };

    return (
        <div className="h-[calc(100vh-6rem)] -mt-4 flex flex-col animate-in fade-in duration-700">
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden relative professional-calendar-container">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    selectable
                    onSelectSlot={handleSelectSlot}
                    eventPropGetter={eventStyleGetter}
                    components={{
                        toolbar: CustomToolbar,
                        event: CustomEvent
                    }}
                    views={['month', 'week', 'day']}
                    defaultView="week"
                    step={30}
                    timeslots={2}
                    className="precisely-styled-calendar text-slate-700 dark:text-slate-200 font-bold"
                />
            </div>

            <AddEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEvent}
                initialDate={selectedSlot}
            />

            <style>{`
                .precisely-styled-calendar .rbc-off-range-bg { background: #fcfdfe; }
                .precisely-styled-calendar .rbc-today { background: #f0f9ff; }
                .precisely-styled-calendar .rbc-header { 
                    padding: 20px 0; 
                    font-weight: 900; 
                    text-transform: uppercase; 
                    font-size: 11px; 
                    color: #94a3b8; 
                    border-bottom: 1px solid #f1f5f9; 
                    border-left: 1px solid #f1f5f9;
                }
                .precisely-styled-calendar .rbc-header:first-child { border-left: none; }
                
                /* Day Indicator Styling */
                .precisely-styled-calendar .rbc-header.rbc-today span {
                    display: inline-block;
                    width: 28px;
                    height: 28px;
                    line-height: 28px;
                    background: #0095ff;
                    color: white;
                    border-radius: 50%;
                    text-align: center;
                    margin-top: 4px;
                    box-shadow: 0 4px 10px rgba(0, 149, 255, 0.3);
                }

                .precisely-styled-calendar .rbc-time-view { border: none; }
                .precisely-styled-calendar .rbc-time-content { border-top: 1px solid #f1f5f9; scrollbar-width: thin; }
                .precisely-styled-calendar .rbc-timeslot-group { border-bottom: 1px solid #f8fafc; min-height: 80px; }
                .precisely-styled-calendar .rbc-day-slot .rbc-events-container { margin-right: 4px; }
                
                .precisely-styled-calendar .rbc-label { 
                    font-weight: 900; 
                    color: #94a3b8; 
                    font-size: 10px; 
                    padding: 10px;
                    text-transform: uppercase;
                }
                
                .precisely-styled-calendar .rbc-time-gutter .rbc-timeslot-group { border-bottom: none; }
                .precisely-styled-calendar .rbc-current-time-indicator { background-color: #0095ff; }

                /* Smooth Scrollbar */
                .rbc-time-content::-webkit-scrollbar { width: 6px; }
                .rbc-time-content::-webkit-scrollbar-track { background: transparent; }
                .rbc-time-content::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default CalendarPage;
