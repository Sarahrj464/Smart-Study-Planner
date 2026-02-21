import { useEffect, useState, cloneElement, useMemo } from 'react';
import RadialProgressGauge from '../components/common/RadialProgressGauge';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { dashboardService } from '../redux/api/dashboardService';
import { goalService } from '../redux/api/goalService';
import { pomodoroService } from '../redux/api/pomodoroService';
import { updateUser, logout } from '../redux/slices/authSlice';
import { toggleTimer } from '../redux/slices/pomodoroSlice';
import {
    Trophy,
    Flame,
    Clock,
    Target,
    TrendingUp,
    Calendar as CalendarIcon,
    ChevronRight,
    BookOpen,
    Users,
    Activity,
    Plus,
    Play,
    Pause,
    RotateCcw,
    Zap,
    HeartPulse,
    Edit,
    Check,
    BarChart3,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

// Calendar Imports
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import toast from 'react-hot-toast';
import ActionModal from '../components/common/ActionModal';

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

// Helper to convert Tasks to Calendar Events
const mapTasksToEvents = (tasks) => {
    if (!tasks) return [];
    return tasks
        .filter(t => !t.completed)
        .map(t => ({
            title: t.title,
            start: new Date(t.dueDate),
            end: new Date(t.dueDate),
            type: t.type.toLowerCase(),
            allDay: true
        }));
};

// Utility Components
const SectionHeader = ({ title, link }) => (
    <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h2>
        {link && (
            <Link to={link} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                View All <ChevronRight size={16} />
            </Link>
        )}
    </div>
);

const QuickActionButton = ({ to, icon, iconColor, label, desc }) => (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
        <Link to={to} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-all shadow-sm group">
            <div className={`p-2 ${iconColor} rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {cloneElement(icon, { size: 16 })}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition-colors truncate">{label}</h4>
                <p className="text-[10px] text-slate-500 truncate">{desc}</p>
            </div>
        </Link>
    </motion.div>
);

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    RadialBarChart,
    RadialBar,
    AreaChart,
    Area,
    Legend,
    PolarAngleAxis
} from 'recharts';

const SmartFocusInsightsCard = ({ data, loading }) => {
    const displayData = data && data.length > 0 ? data : [
        { time: '10:00 AM', value: 0, secondary: 0 },
        { time: '1:00 PM', value: 0, secondary: 0 },
        { time: '4:00 PM', value: 0, secondary: 0 },
        { time: '7:00 PM', value: 0, secondary: 0 },
    ];

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-xl flex flex-col h-[400px] relative overflow-hidden"
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg tracking-tight">Smart Focus Insights</h3>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 rounded-full cursor-pointer hover:bg-slate-100 transition-colors">
                    <span className="text-[11px] font-bold text-slate-500">Analyze Hours</span>
                    <ChevronRight size={14} className="rotate-90 text-slate-400" />
                </div>
            </div>

            <div className="flex-1 mt-4 relative min-h-[250px]">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={displayData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="time"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                interval={3}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#a3a3a3', fontSize: 10, fontWeight: 700 }}
                                tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                                dx={-5}
                            />
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                            <RechartsTooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const mins = payload[0].payload.minutes || 0;
                                        return (
                                            <div className="flex flex-col items-center">
                                                <div className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-xl mb-1 ring-2 ring-white">
                                                    {mins} mins
                                                </div>
                                                <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-md ring-2 ring-emerald-100" />
                                                <div className="h-20 w-0.5 bg-emerald-500/30 -mt-0.5" />
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                                cursor={false}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#10b981"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#focusGradient)"
                            />
                            <Area
                                type="monotone"
                                dataKey="secondary"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                fill="transparent"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Focus Time</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secondary</span>
                </div>
            </div>
        </motion.div>
    );
};

const WeeklyProgressCard = ({ data, loading }) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });

    // Ensure we always have 7 days
    const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const chartData = useMemo(() => {
        const dataMap = {};
        if (data) {
            data.forEach(d => {
                dataMap[d.day] = d.hours || 0;
            });
        }

        return allDays.map(day => ({
            day,
            hours: dataMap[day] || 0,
            isToday: day === today
        }));
    }, [data, today]);

    // Use max value from data to scale bars
    const dynamicMaxHours = useMemo(() => {
        const maxVal = Math.max(...chartData.map(d => d.hours), 0);
        return maxVal > 1 ? maxVal : 1; // At least 1h scale
    }, [chartData]);

    const CustomBar = (props) => {
        const { x, y, width, height, payload } = props;
        if (!payload) return null;

        const radius = width / 2;
        const isToday = payload.isToday;
        const value = payload.hours || 0;

        // Calculate height based on scale
        const barHeight = Math.max((value / dynamicMaxHours) * height, width); // Minimum height is width for a circle
        const barY = y + height - barHeight;

        return (
            <g>
                <rect
                    x={x}
                    y={barY}
                    width={width}
                    height={barHeight}
                    rx={radius}
                    fill={isToday ? '#3b82f6' : 'url(#stripes)'}
                    className="transition-all duration-300"
                />
                {isToday && (
                    <circle cx={x + width / 2} cy={barY} r={3} fill="#1e3a8a" />
                )}
            </g>
        );
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-xl flex flex-col h-[400px] relative overflow-hidden"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg tracking-tight">Weekly progress</h3>
                    <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-wider">Productivity</p>
                </div>
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                    <BarChart3 size={18} />
                </motion.div>
            </div>

            {/* Content & Progress */}
            <div className="flex-1 mt-2 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 30, right: 10, left: 10, bottom: 0 }}>
                        <defs>
                            <pattern id="stripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                <rect width="4" height="8" fill="#eff6ff" />
                                <rect x="4" width="4" height="8" fill="#dbeafe" />
                            </pattern>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis hide />
                        <RechartsTooltip
                            cursor={false}
                            offset={-40}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const val = payload[0].value;
                                    return (
                                        <div className="flex flex-col items-center -translate-y-4">
                                            <div className="bg-[#1e1e1e] text-white px-3 py-1.5 rounded-full text-[12px] font-bold shadow-2xl min-w-[40px] text-center border border-white/10">
                                                {val * 60}
                                            </div>
                                            <div className="w-1.5 h-1.5 bg-[#1e1e1e] rounded-full mt-1 border border-white/20 shadow-lg" />
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="hours"
                            barSize={32}
                            shape={<CustomBar />}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-[10px] font-bold text-slate-400">This Week</span>
                </div>
                <button
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-all flex items-center gap-1.5"
                >
                    Add a comparison <Plus size={12} />
                </button>
            </div>
        </motion.div >
    );
};

const MonthProgressCard = ({ data, loading, productivityScore }) => {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        const gradients = ['url(#blueGradient)', 'url(#purpleGradient)', 'url(#pinkGradient)', 'url(#yellowGradient)'];
        const colors = ['#2563eb', '#9333ea', '#db2777', '#d97706']; // For legend
        const categories = ['Tasks', 'Class', 'Exams', 'Focus'];

        return categories.map((cat, i) => {
            const item = data.find(d => d.label?.toLowerCase() === cat.toLowerCase());
            let val = item ? item.count : 0;

            // For the radial bar, we need percentage. 
            // If it's Focus and it's in hours, let's scale it (e.g. 10h = 100%)
            let internalValue = val;
            if (cat === 'Focus') {
                internalValue = Math.min((val / 10) * 100, 100);
            }

            return {
                name: cat,
                value: internalValue,
                displayValue: val,
                fill: gradients[i % gradients.length],
                color: colors[i % colors.length]
            };
        }).reverse();
    }, [data]);

    const total = productivityScore || 0;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-xl relative overflow-hidden group h-[400px] flex flex-col"
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-extrabold text-slate-800 text-xl tracking-tight leading-tight">Month Progress</h3>
                    <p className="text-xs font-bold text-emerald-500 mt-0.5 flex items-center gap-1">
                        +20% <span className="text-[9px]">vs last month</span> ↑
                    </p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                    <TrendingUp size={18} strokeWidth={2.5} />
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row items-center gap-6 mt-4 overflow-hidden">
                {/* Legend Left */}
                <div className="flex flex-col gap-2.5 min-w-[120px]">
                    {['Tasks', 'Class', 'Exams', 'Focus'].map((cat, i) => {
                        const colors = ['#2563eb', '#9333ea', '#db2777', '#d97706'];
                        const item = data?.find(d => d.label?.toLowerCase() === cat.toLowerCase());
                        const val = item ? item.count : 0;
                        const hasActivity = val > 0;
                        return (
                            <div key={i} className="flex items-center justify-between group/legend py-0.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full transition-colors duration-500 shadow-[0_0_8px_rgba(0,0,0,0.05)]" style={{ backgroundColor: colors[i] }} />
                                    <span className="text-[13px] font-bold tracking-tight text-slate-800 transition-colors group-hover/legend:text-slate-900">{cat}</span>
                                </div>
                                <span className={`text-[13px] font-extrabold transition-colors ${hasActivity ? 'text-slate-500 group-hover/legend:text-slate-900' : 'text-slate-300'}`}>
                                    {val}{cat === 'Focus' ? 'h' : '%'}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Concentric Rings Right */}
                <div className="relative flex-1 min-h-[280px] h-full flex items-center justify-center">
                    {chartData.some(d => d.displayValue > 0) ? (
                        <>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="45%"
                                    outerRadius="100%"
                                    barSize={9}
                                    data={chartData}
                                    startAngle={90}
                                    endAngle={450}
                                >
                                    <defs>
                                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#2563eb" />
                                        </linearGradient>
                                        <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#a855f7" />
                                            <stop offset="100%" stopColor="#9333ea" />
                                        </linearGradient>
                                        <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f472b6" />
                                            <stop offset="100%" stopColor="#db2777" />
                                        </linearGradient>
                                        <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#fbbf24" />
                                            <stop offset="100%" stopColor="#d97706" />
                                        </linearGradient>
                                    </defs>
                                    <PolarAngleAxis
                                        type="number"
                                        domain={[0, 100]}
                                        angleAxisId={0}
                                        tick={false}
                                    />
                                    <RadialBar
                                        background={{ fill: '#f1f5f9' }}
                                        dataKey="value"
                                        cornerRadius={20}
                                    />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-1">
                                <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{total}%</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] text-center mt-2 opacity-60">Complete</span>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-2">
                                <Target size={24} strokeWidth={1.5} />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400">No activity yet</p>
                            <button onClick={() => toast.success('Add a task to start tracking!')} className="text-[8px] font-black text-blue-500 uppercase tracking-widest hover:underline cursor-pointer">Start Now</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-2 pt-3 border-t border-slate-50 flex items-center justify-end">
                <button
                    onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8,"
                            + "Subject,Progress\n"
                            + (data?.map(e => `${e.label},${e.count}`).join("\n") || "");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `Productivity_Report_Feb_2026.csv`);
                        document.body.appendChild(link);
                        link.click();
                        toast.success("Downloading Productivity Report...");
                    }}
                    className="text-[11px] font-black text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                >
                    Download Report <TrendingUp size={12} className="rotate-45" />
                </button>
            </div>
        </motion.div>
    );
};

const MonthGoalsCard = ({ goals, loading, onToggle, onAdd }) => {
    const completedCount = goals?.filter(g => g.completed).length || 0;
    const totalCount = goals?.length || 0;
    const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-xl relative overflow-hidden group h-[400px] flex flex-col"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-full h-full rotate-[-90deg]">
                            <circle cx="24" cy="24" r="20" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                            <motion.circle
                                cx="24" cy="24" r="20" stroke="#f59e0b" strokeWidth="4" fill="transparent"
                                strokeDasharray="125.6"
                                animate={{ strokeDashoffset: 125.6 - (125.6 * completionPercent / 100) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-[9px] font-black text-slate-800 leading-none">{completedCount}/{totalCount}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg tracking-tight">Month goals</h3>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onAdd} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar flex-1">
                <AnimatePresence mode="popLayout">
                    {goals && goals.length > 0 ? goals.map((goal, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={goal._id || i}
                            className={`flex items-center gap-4 group/item cursor-pointer p-2 rounded-2xl transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100`}
                            onClick={() => onToggle(goal._id, goal.completed)}
                        >
                            <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all shadow-sm ${goal.completed ? 'bg-blue-600 border-blue-600' : 'border-slate-200 group-hover/item:border-blue-600 bg-white'}`}>
                                {goal.completed ? <Check size={14} className="text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover/item:bg-blue-400 transition-colors" />}
                            </div>
                            <span className={`text-[13px] font-bold transition-all flex-1 ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                {goal.title}
                            </span>
                        </motion.div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-4 text-center opacity-40">
                            <Target size={24} className="text-slate-300 mb-2" />
                            <p className="text-[11px] font-bold text-slate-400">No monthly goals yet</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-4 flex items-center justify-end">
                <button onClick={() => toast.success('Goal editing coming soon')} className="p-1 text-slate-300 hover:text-slate-500 transition-colors">
                    <Edit size={14} />
                </button>
            </div>
        </motion.div>
    );
};

const CalendarPreview = ({ events }) => (
    <div className="h-[600px] w-full professional-preview bg-white rounded-[40px] p-8 border border-slate-100 shadow-2xl relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />

        <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
                <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <CalendarIcon size={32} className="text-blue-500" />
                    Calendar
                </h2>
                <p className="text-sm text-slate-400 font-bold mt-1">Plan and schedule your activities</p>
            </div>
            <Link to="/calendar" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95">
                Full Schedule <ChevronRight size={16} />
            </Link>
        </div>

        <div className="h-[calc(100%-100px)] relative z-10">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                views={['month']}
                defaultView="month"
                toolbar={true}
                components={{
                    event: ({ event }) => (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`p-2.5 rounded-2xl text-[10px] font-black truncate shadow-lg border-l-4 transition-all ${event.type === 'exam' ? 'bg-rose-500/10 text-rose-600 border-rose-500' :
                                event.type === 'vacation' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500' :
                                    event.type === 'class' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500' :
                                        'bg-blue-600/10 text-blue-600 border-blue-600'
                                }`}
                        >
                            <div className="flex items-center gap-1.5 mb-1 opacity-70">
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                10:00 AM
                            </div>
                            {event.title}
                        </motion.div>
                    )
                }}
                className="text-xs font-bold"
            />
        </div>
        <style>{`
            .professional-preview .rbc-header { 
                font-weight: 900; 
                text-transform: uppercase; 
                font-size: 11px; 
                color: #94a3b8; 
                padding: 20px 0; 
                border-bottom: 1px solid #f1f5f9; 
            }
            .professional-preview .rbc-off-range-bg { background: #fbfcfe; }
            .professional-preview .rbc-today { background: #f0f7ff; }
            .professional-preview .rbc-month-view { border: none !important; }
            .professional-preview .rbc-day-bg { border-left: 1px solid #f1f5f9; border-top: 1px solid #f1f5f9; }
            .professional-preview .rbc-month-row { border-top: none; }
            .professional-preview .rbc-date-cell { padding: 15px; font-weight: 800; color: #64748b; font-size: 13px; }
            .professional-preview .rbc-event { background: none !important; padding: 4px !important; }
            .professional-preview .rbc-toolbar { margin-bottom: 25px; }
            .professional-preview .rbc-toolbar button { 
                border: 1px solid #f1f5f9; 
                font-weight: 900; 
                color: #64748b; 
                text-transform: uppercase; 
                font-size: 10px; 
                padding: 10px 20px; 
                border-radius: 12px;
                margin: 0 4px;
            }
            .professional-preview .rbc-toolbar button:hover { background: #f8fafc; }
            .professional-preview .rbc-toolbar button.rbc-active { background: #2563EB; color: white; border-color: #2563EB; }
        `}</style>
    </div>
);

const RefinedStatCard = ({ icon, label, value, subValue, percentage, color, trend, loading, hideGauge, isPrimary, comparison, description }) => {
    if (loading) {
        return (
            <div className={`bg-white p-6 rounded-[32px] border border-slate-100 animate-pulse ${isPrimary ? 'h-40' : 'h-32'}`}>
                <div className="h-8 w-8 bg-slate-50 rounded-2xl mb-3" />
                <div className="h-3 w-20 bg-slate-50 rounded mb-2" />
                <div className="h-6 w-14 bg-slate-50 rounded" />
            </div>
        );
    }

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-white py-4 px-6 rounded-[32px] border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.03)] transition-all relative overflow-hidden group h-full flex flex-col justify-between`}
        >
            {/* 3 Circles Decoration */}
            <div className="absolute -top-6 -right-6 flex gap-2 rotate-12 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
                <div className={`w-12 h-12 rounded-full border-2 border-current ${color}`} />
                <div className={`w-8 h-8 rounded-full border-2 border-current mt-8 ${color}`} />
                <div className={`w-4 h-4 rounded-full border-2 border-current mt-4 ${color}`} />
            </div>

            <div>
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl shadow-sm ${color.replace('text-', 'bg-').replace('-500', '-500/10').replace('-600', '-600/10')}`}>
                            {typeof icon === 'string' ? <span className="text-xl">{icon}</span> : cloneElement(icon, { size: 18 })}
                        </div>
                        <h3 className="font-bold text-[13px] text-slate-800 tracking-tight">{label}</h3>
                    </div>
                </div>

                <div className="space-y-1">
                    {comparison && (
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
                            {comparison}
                        </p>
                    )}
                    <div className="flex items-baseline gap-2">
                        <span className={`text-2xl md:text-3xl font-black tracking-tight ${color}`}>
                            {value}
                        </span>
                        {subValue && (
                            <span className="text-[10px] font-bold text-slate-400">{subValue}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-end justify-between mt-1">
                {description && (
                    <p className="text-[10px] md:text-[11px] font-bold text-slate-400 leading-relaxed max-w-[140px]">
                        {description}
                    </p>
                )}

                {!hideGauge && (
                    <div className="w-28 h-14 opacity-100 group-hover:scale-110 transition-transform ml-auto relative z-10 flex justify-end">
                        <RadialProgressGauge
                            value={percentage || 0}
                            color={color.includes('emerald') ? '#059669' : color.includes('rose') ? '#e11d48' : color.includes('blue') ? '#1d4ed8' : '#7c3aed'}
                            size={95}
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const Dashboard = () => {
    const { user, token } = useSelector((state) => state.auth);
    const { timeLeft, isActive, mode } = useSelector((state) => state.pomodoro);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [calendarEvents, setCalendarEvents] = useState([]);

    // Modal State
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);

    // Timer logic is now handled by GlobalTimer component

    const MODES = {
        focus: { label: 'Focus', color: 'text-blue-600', bg: '#2563EB' },
        short: { label: 'Short Break', color: 'text-emerald-500', bg: '#10b981' },
        long: { label: 'Long Break', color: 'text-indigo-500', bg: '#6366f1' }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getStats();
                if (data.success) {
                    setStats(data.data);
                    setCalendarEvents(mapTasksToEvents(data.data?.user?.taskStats?.upcomingTasks));
                }
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };

        if (token) {
            fetchStats();
        }
    }, [dispatch, token]);

    const handleToggleGoal = async (goalId, completed) => {
        try {
            await goalService.updateGoal(goalId, { completed: !completed });
            // Refresh stats
            const data = await dashboardService.getStats();
            setStats(data.data);
        } catch (err) {
            toast.error('Failed to update goal');
        }
    };

    const handleAddGoal = () => {
        setNewGoalTitle('');
        setIsGoalModalOpen(true);
    };

    const handleConfirmGoal = async () => {
        if (!newGoalTitle.trim()) return;
        setIsSubmittingGoal(true);
        try {
            await goalService.createGoal({ title: newGoalTitle, type: 'monthly' });
            toast.success('Goal added!');
            setNewGoalTitle('');
            setIsGoalModalOpen(false);
            // Refresh stats
            const data = await dashboardService.getStats();
            setStats(data.data);
        } catch (err) {
            toast.error('Failed to add goal');
        } finally {
            setIsSubmittingGoal(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.1,
                when: "beforeChildren",
                staggerChildren: 0
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: { duration: 0 }
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        if (hour < 21) return "Good Evening";
        return "Good Night";
    };

    const getStreakMessage = (days) => {
        if (days === 0) return "Start your journey today! 🚀";
        if (days <= 2) return "Keep it up! ✨";
        if (days <= 5) return "You're on fire! 🔥";
        return "Legendary status! 👑";
    };

    // Use metrics calculated by the backend
    const totalTasks = (stats?.user?.taskStats?.completed || 0) + (stats?.user?.taskStats?.pending || 0) + (stats?.user?.taskStats?.overdue || 0);
    const completionRate = totalTasks > 0 ? Math.round(((stats?.user?.taskStats?.completed || 0) / totalTasks) * 100) : 0;

    const productivityScore = stats?.user?.studyStats?.productivityScore ?? 0;
    const studyHours = parseFloat(stats?.user?.studyStats?.totalHours || 0);
    const streak = stats?.user?.studyStats?.streak || 0;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 w-full pb-10"
        >
            {/* Row 1: Welcome & Gamification & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Welcome & Gamification */}
                <div className="lg:col-span-8">
                    <div className="bg-blue-600 rounded-[32px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-white relative overflow-hidden h-full shadow-2xl shadow-blue-500/20">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none" />

                        <div className="space-y-4 relative z-10 w-full md:w-auto text-center md:text-left">
                            <h2 className="text-lg font-medium opacity-90">
                                <span className="font-bold">{stats?.user?.taskStats?.pending || 0}</span> tasks due today.
                            </h2>
                            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                                {getGreeting()},<br />
                                {user?.name?.split(' ')[0]}.
                            </h1>
                        </div>

                        {/* Active Timer Card */}
                        <div className="bg-white rounded-[28px] p-2 shadow-lg max-w-sm w-full md:w-auto">
                            <div className="bg-slate-50 rounded-[24px] px-6 py-5 flex items-center gap-6 w-full">
                                <div className="relative w-40 h-40 flex-shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                                        <motion.circle
                                            cx="80" cy="80" r="70"
                                            stroke={MODES[mode]?.bg || '#2563EB'}
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray="440"
                                            animate={{
                                                strokeDashoffset: 440 - (440 * (timeLeft / (mode === 'focus' ? 25 * 60 : mode === 'short' ? 5 * 60 : 15 * 60)))
                                            }}
                                            transition={{ duration: 0.5, ease: "linear" }}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-slate-700">
                                        <span className="text-xs font-bold uppercase tracking-wider opacity-60 mb-0.5">
                                            {MODES[mode]?.label || 'Focus'}
                                        </span>
                                        <span className="text-3xl font-black tracking-tight">{formatTime(timeLeft)}</span>
                                        {isActive && (
                                            <span className="text-xs font-bold text-emerald-500 mt-1 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                Active
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 items-center justify-center">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            dispatch(toggleTimer());
                                        }}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all hover:scale-110 active:scale-95 ${MODES[mode]?.bg ? `bg-[${MODES[mode].bg}]` : 'bg-blue-600'}`}
                                        style={{ backgroundColor: MODES[mode]?.bg || '#2563EB' }}
                                        title={isActive ? "Pause Timer" : "Start Timer"}
                                    >
                                        {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                                    </button>

                                    <Link
                                        to="/pomodoro"
                                        className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 shadow-sm transition-all hover:scale-110 active:scale-95"
                                        title="Go to Pomodoro Page"
                                    >
                                        <ChevronRight size={20} strokeWidth={3} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                    <QuickActionButton to="/pomodoro" icon={<Clock className="text-white" />} iconColor="bg-blue-500" label="Start Session" desc="Deep study mode" />
                    <QuickActionButton to="/study-rooms" icon={<Users className="text-white" />} iconColor="bg-emerald-500" label="Join Room" desc="Study together" />
                    <QuickActionButton to="/wellness" icon={<Activity className="text-white" />} iconColor="bg-pink-500" label="Mood Check-in" desc="Mindfulness" />
                    <QuickActionButton to="/blog" icon={<BookOpen className="text-white" />} iconColor="bg-indigo-500" label="Community" desc="Articles & Ideas" />
                </div>
            </div>

            {/* Metrics Row 1: Productivity, Health, Streak */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <RefinedStatCard
                    loading={loading}
                    icon="📊"
                    label="Productivity Score"
                    value={`${productivityScore}/100`}
                    percentage={productivityScore}
                    color="text-blue-600"
                    comparison="vs last month: 0"
                    description="Overall score based on logs."
                />

                <RefinedStatCard
                    loading={loading}
                    icon={<HeartPulse size={24} className="text-pink-500" />}
                    label="Health & Mood"
                    value={stats?.analytics?.avgMood ? `${stats.analytics.avgMood}/5.0` : 'N/A'}
                    percentage={(stats?.analytics?.avgMood || 0) * 20}
                    color="text-pink-500"
                    description="Daily mood average."
                />

                <RefinedStatCard
                    loading={loading}
                    icon={<Flame size={24} className="text-orange-500" />}
                    label="Current Streak"
                    value={`${streak}\u00A0\u00A0${streak === 1 ? 'Day' : 'Days'}`}
                    hideGauge={true}
                    description={getStreakMessage(streak)}
                    color="text-orange-500"
                />
            </div>

            {/* Metrics Row 2: Tasks Done, Pending, Overdue, Hours */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <RefinedStatCard loading={loading} icon={<CheckCircle2 className="text-emerald-600" size={24} />} label="Tasks Done" value={`${completionRate}%`} percentage={completionRate} color="text-emerald-600" />
                <RefinedStatCard loading={loading} icon={<Clock className="text-slate-500" size={24} />} label="Pending Task" value={stats?.user?.taskStats?.pending || 0} percentage={Math.min((stats?.user?.taskStats?.pending || 0) * 10, 100)} color="text-slate-500" />
                <RefinedStatCard loading={loading} icon={<AlertCircle className="text-rose-600" size={24} />} label="Overdue Task" value={stats?.user?.taskStats?.overdue || 0} color="text-rose-600" percentage={Math.min((stats?.user?.taskStats?.overdue || 0) * 20, 100)} />
                <RefinedStatCard
                    loading={loading}
                    icon={<BookOpen className="text-blue-500" size={24} />}
                    label="Study hours"
                    value={studyHours >= 1 ? studyHours.toFixed(1) : (stats?.user?.studyStats?.totalMinutes || 0)}
                    subValue={studyHours >= 1 ? 'hrs' : 'mins'}
                    percentage={Math.min((studyHours / 40) * 100, 100)}
                    color="text-blue-500"
                />
            </div>

            {/* Analytics Section */}
            <div className="space-y-6">
                {/* Top Row: Progress Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <WeeklyProgressCard data={stats?.analytics?.weeklyProgress} loading={loading} />
                    <MonthProgressCard
                        data={stats?.analytics?.categoricalProgress}
                        loading={loading}
                        productivityScore={productivityScore}
                    />
                </div>

                {/* Bottom Row: Month Goals (Full width or centered) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <SmartFocusInsightsCard data={stats?.analytics?.hourlyStats} loading={loading} />
                    <MonthGoalsCard
                        goals={stats?.analytics?.monthGoals}
                        loading={loading}
                        onToggle={handleToggleGoal}
                        onAdd={handleAddGoal}
                    />
                </div>
            </div>

            {/* Row 4: Calendar */}
            <motion.div variants={itemVariants} className="w-full">
                <CalendarPreview events={calendarEvents} />
            </motion.div>

            {/* Custom Modals */}
            <ActionModal
                isOpen={isGoalModalOpen}
                onClose={() => setIsGoalModalOpen(false)}
                onConfirm={handleConfirmGoal}
                title="Add Month Goal"
                placeholder="What do you want to achieve this month?"
                value={newGoalTitle}
                setValue={setNewGoalTitle}
                loading={isSubmittingGoal}
            />
        </motion.div>
    );
};

export default Dashboard;
