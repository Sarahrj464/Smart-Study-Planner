import { Calendar as CalendarIcon, Clock, CheckCircle, Trash2, MapPin, User, Tag, Timer, Repeat, Wifi, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const priorityConfig = {
    high: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', dot: 'bg-red-500', label: 'High' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', dot: 'bg-amber-500', label: 'Medium' },
    low: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500', label: 'Low' },
};

const typeConfig = {
    task: { icon: '📝', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', label: 'Task' },
    Task: { icon: '📝', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', label: 'Task' },
    class: { icon: '📚', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', label: 'Class' },
    Class: { icon: '📚', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', label: 'Class' },
    exam: { icon: '📄', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', label: 'Exam' },
    Exam: { icon: '📄', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', label: 'Exam' },
    Quiz: { icon: '📋', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', label: 'Quiz' },
    Test: { icon: '✏️', bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100', label: 'Test' },
    vacation: { icon: '🏖️', bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', label: 'Vacation' },
    Vacation: { icon: '🏖️', bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', label: 'Vacation' },
};

const TaskItem = ({ task, onToggle, onDelete, showDelete = true }) => {
    const priority = priorityConfig[(task.priority || 'medium').toLowerCase()] || priorityConfig.medium;
    const taskType = typeConfig[task.type] || typeConfig.task;
    const isVacation = task.type === 'Vacation' || task.type === 'vacation';
    const isClass = task.type === 'Class' || task.type === 'class';
    const isExam = ['Exam', 'exam', 'Quiz', 'Test'].includes(task.type);
    const isOnline = task.mode === 'Online' || task.mode === 'online' || task.examMode === 'online';
    const hasMeetingLink = task.meetingLink && task.meetingLink.trim() !== '';

    const formatDate = (date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatDuration = (mins) => {
        if (!mins) return null;
        if (mins < 60) return `${mins}m`;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group flex items-start justify-between gap-4 ${task.completed ? 'opacity-60' : ''}`}
        >
            <div className="flex items-start gap-4 flex-1 min-w-0">
                {!isVacation ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggle(task); }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 mt-0.5 ${task.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300 hover:bg-emerald-100 hover:text-emerald-500'}`}
                    >
                        {task.completed
                            ? <CheckCircle size={22} fill="white" className="text-white" />
                            : <div className="w-5 h-5 rounded-full border-[2.5px] border-slate-300" />}
                    </button>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5 text-base">🏖️</div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className={`font-bold text-sm md:text-base text-slate-800 dark:text-white truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>
                            {task.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${taskType.bg} ${taskType.text} border ${taskType.border} shrink-0`}>
                            {taskType.icon} {taskType.label}
                        </span>
                        {task.subject && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                                {task.subject}
                            </span>
                        )}
                        {task.course && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-violet-50 text-violet-600 border border-violet-100 shrink-0">
                                {task.course}
                            </span>
                        )}
                        {isOnline && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0 flex items-center gap-1">
                                <Wifi size={9} /> Online
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] font-bold text-slate-400">
                        {(task.dueDate || task.startDate) && (
                            <span className="flex items-center gap-1">
                                <CalendarIcon size={11} />
                                {formatDate(task.dueDate || task.startDate)}
                                {isVacation && task.endDate && <> → {formatDate(task.endDate)}</>}
                            </span>
                        )}
                        {(task.time || task.startTime) && !isVacation && (
                            <span className="flex items-center gap-1">
                                <Clock size={11} />
                                {task.time || task.startTime}
                                {isClass && task.endTime && <> – {task.endTime}</>}
                            </span>
                        )}
                        {(task.duration || task.estimatedMinutes) && !isVacation && (
                            <span className="flex items-center gap-1">
                                <Timer size={11} />
                                {formatDuration(task.duration || task.estimatedMinutes)}
                            </span>
                        )}
                        {isClass && task.teacher && (
                            <span className="flex items-center gap-1"><User size={11} />{task.teacher}</span>
                        )}
                        {(isClass || isExam) && task.room && (
                            <span className="flex items-center gap-1">
                                <MapPin size={11} />
                                {task.room}{isClass && task.building ? `, ${task.building}` : ''}
                            </span>
                        )}
                        {isExam && task.seat && (
                            <span className="flex items-center gap-1">🪑 Seat {task.seat}</span>
                        )}
                        {isClass && (task.occurs === 'Repeating' || task.occurs === 'repeating') && (
                            <span className="flex items-center gap-1">
                                <Repeat size={11} />
                                {task.repeatDays && task.repeatDays.length > 0 ? task.repeatDays.join(', ') : 'Repeating'}
                            </span>
                        )}
                        {isExam && task.examType && (
                            <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-500 border border-orange-100">{task.examType}</span>
                        )}
                        {!isVacation && task.priority && (
                            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${priority.bg} ${priority.text} ${priority.border}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                                {priority.label}
                            </span>
                        )}
                    </div>

                    {/* Join Button */}
                    {isOnline && hasMeetingLink && (
                        <div className="mt-2.5">
                            <a
                                href={task.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95 ${isExam
                                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'}`}
                            >
                                <Wifi size={11} />
                                {isExam ? 'Join Exam' : 'Join Class'}
                                <ExternalLink size={10} />
                            </a>
                        </div>
                    )}

                    {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {task.tags.map((tag, i) => (
                                <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-[9px] font-bold">
                                    <Tag size={8} /> {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    {task.details && (
                        <p className="mt-1.5 text-[11px] text-slate-400 line-clamp-1">{task.details}</p>
                    )}
                </div>
            </div>

            {showDelete && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 shrink-0 mt-0.5"
                >
                    <Trash2 size={16} />
                </button>
            )}
        </motion.div>
    );
};

export default TaskItem;