// frontend/src/components/forms/TaskForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../../redux/slices/taskSlice';
import { Clock, Plus, X, Tag } from 'lucide-react';
import TimePicker from '../common/TimePicker';

const SUBJECTS = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Computer Science', 'History', 'Geography', 'English', 'Other'
];

const TIME_OPTIONS = [
    { value: 15, label: '15 mins' },
    { value: 30, label: '30 mins' },
    { value: 45, label: '45 mins' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' },
];

const TaskForm = ({ onSubmit, onClose }) => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('task');
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Common fields
        type: 'task',
        title: '',
        details: '',
        subject: '',

        // ⭐ NEW - Priority & Time Estimation
        priority: 'medium',
        estimatedMinutes: 30,
        tags: [],

        // Scheduling
        dueDate: '',
        time: '',
        occurs: 'once',
        repeatFrequency: 'daily',

        // Exam specific
        examType: 'exam',
        examMode: 'in-person',
        seat: '',
        room: '',
        duration: '',

        // Class specific
        className: '',
        teacher: '',
        mode: 'in-person',
        building: '',
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // ⭐ Tag Management
    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                handleChange('tags', [...formData.tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const taskData = {
                ...formData,
                type: activeTab,
                dueTime: formData.time,
            };

            // Check if parent component handles submission
            if (onSubmit) {
                await onSubmit(taskData);
            } else {
                // Otherwise use Redux directly (e.g. from Modal)
                await dispatch(createTask(taskData)).unwrap();
            }

            // Close modal if exists
            if (onClose) {
                onClose();
            }

            // Reset form
            setFormData({
                type: 'task',
                title: '',
                details: '',
                subject: '',
                priority: 'medium',
                estimatedMinutes: 30,
                tags: [],
                dueDate: '',
                time: '',
                occurs: 'once',
                repeatFrequency: 'daily',
                examType: 'exam',
                examMode: 'in-person',
                seat: '',
                room: '',
                duration: '',
                className: '',
                teacher: '',
                mode: 'in-person',
                building: '',
            });
        } catch (error) {
            console.error('Failed to create task:', error);
            alert('Failed to create task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ============ TASK FIELDS ============
    const renderTaskFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="e.g. Finish Homework"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        required
                    />
                </div>

                {/* Subject */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Subject *
                    </label>
                    <select
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        required
                    >
                        <option value="">Select Subject</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Details
                </label>
                <textarea
                    value={formData.details}
                    onChange={(e) => handleChange('details', e.target.value)}
                    placeholder="Add any additional details..."
                    rows="3"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
            </div>

            {/* ⭐ PRIORITY BUTTONS */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Priority *
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { value: 'high', label: 'High', emoji: '🔴', color: 'red' },
                        { value: 'medium', label: 'Medium', emoji: '🟡', color: 'yellow' },
                        { value: 'low', label: 'Low', emoji: '🟢', color: 'green' }
                    ].map(priority => (
                        <button
                            key={priority.value}
                            type="button"
                            onClick={() => handleChange('priority', priority.value)}
                            className={`py-3 px-4 rounded-xl font-bold text-sm transition-all ${formData.priority === priority.value
                                ? priority.color === 'red'
                                    ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500 text-red-700 dark:text-red-400'
                                    : priority.color === 'yellow'
                                        ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500 text-yellow-700 dark:text-yellow-400'
                                        : 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500 text-green-700 dark:text-green-400'
                                : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                                }`}
                        >
                            <span className="mr-2">{priority.emoji}</span>
                            {priority.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ⭐ ESTIMATED TIME */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Estimated Time
                </label>
                <select
                    value={formData.estimatedMinutes}
                    onChange={(e) => handleChange('estimatedMinutes', Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                    {TIME_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Due Date *
                    </label>
                    <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleChange('dueDate', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Time
                    </label>
                    <div
                        onClick={() => setShowTimePicker(true)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer flex items-center justify-between"
                    >
                        {formData.time || 'Select Time'}
                        <Clock size={16} className="text-slate-400" />
                    </div>
                    {showTimePicker && (
                        <TimePicker
                            value={formData.time}
                            onChange={(time) => handleChange('time', time)}
                            onClose={() => setShowTimePicker(false)}
                        />
                    )}
                </div>
            </div>

            {/* Occurs */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Occurs
                </label>
                <div className="flex bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    {['once', 'repeating'].map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => handleChange('occurs', opt)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${formData.occurs === opt
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            {opt === 'once' ? 'Once' : 'Repeating'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Repeat Frequency (if repeating) */}
            {formData.occurs === 'repeating' && (
                <div className="space-y-2 animate-fadeIn">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Repeat Every
                    </label>
                    <select
                        value={formData.repeatFrequency}
                        onChange={(e) => handleChange('repeatFrequency', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekdays">Weekdays (Mon-Fri)</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            )}

            {/* ⭐ TAGS INPUT */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Tag size={14} />
                    Tags (Press Enter to add)
                </label>
                <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleAddTag}
                    placeholder="e.g., important, revision, homework"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {formData.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-bold"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                                >
                                    <X size={14} strokeWidth={3} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </>
    );

    // ============ EXAM FIELDS ============
    // ============ EXAM FIELDS ============
    const renderExamFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Exam Name *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="e.g. Midterm Exam"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Subject *
                    </label>
                    <select
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        required
                    >
                        <option value="">Select Subject</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Type & Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {['exam', 'quiz', 'test'].map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => handleChange('examType', type)}
                                className={`py-2.5 rounded-xl text-sm font-bold transition-all ${formData.examType === type
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                    }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Mode
                    </label>
                    <div className="flex bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        {['in-person', 'online'].map(mode => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => handleChange('examMode', mode)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${formData.examMode === mode
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {mode === 'in-person' ? 'In Person' : 'Online'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Seat & Room */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Seat #
                    </label>
                    <input
                        type="text"
                        value={formData.seat}
                        onChange={(e) => handleChange('seat', e.target.value)}
                        placeholder="e.g. A-23"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Room
                    </label>
                    <input
                        type="text"
                        value={formData.room}
                        onChange={(e) => handleChange('room', e.target.value)}
                        placeholder="e.g. Room 101"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Date, Time & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Date *
                    </label>
                    <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleChange('dueDate', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Time *
                    </label>
                    <div
                        onClick={() => setShowTimePicker(true)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer flex items-center justify-between"
                    >
                        {formData.time || 'Select Time'}
                        <Clock size={16} className="text-slate-400" />
                    </div>
                    {showTimePicker && (
                        <TimePicker
                            value={formData.time}
                            onChange={(time) => handleChange('time', time)}
                            onClose={() => setShowTimePicker(false)}
                        />
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Duration (mins)
                    </label>
                    <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => handleChange('duration', e.target.value)}
                        placeholder="e.g. 120"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* ⭐ New Priority & Tags for Exams */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Priority *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {['high', 'medium', 'low'].map(p => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => handleChange('priority', p)}
                                className={`py-3 px-4 rounded-xl font-bold text-xs transition-all ${formData.priority === p
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                    }`}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <Tag size={14} />
                        Tags (Press Enter)
                    </label>
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleAddTag}
                        placeholder="e.g. final, important"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold flex items-center gap-2">
                            {tag}
                            <X size={14} className="cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                        </span>
                    ))}
                </div>
            )}
        </>
    );

    // ============ CLASS FIELDS ============
    const renderClassFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Subject *
                    </label>
                    <select
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        required
                    >
                        <option value="">Select Subject</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Class Name
                    </label>
                    <input
                        type="text"
                        value={formData.className}
                        onChange={(e) => handleChange('className', e.target.value)}
                        placeholder="e.g. Advanced Calculus"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Mode & Teacher */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Mode
                    </label>
                    <div className="flex bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        {['in-person', 'online'].map(mode => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => handleChange('mode', mode)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${formData.mode === mode
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {mode === 'in-person' ? 'In Person' : 'Online'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Teacher
                    </label>
                    <input
                        type="text"
                        value={formData.teacher}
                        onChange={(e) => handleChange('teacher', e.target.value)}
                        placeholder="Teacher name"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Occurs */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Occurs
                </label>
                <div className="flex bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    {['once', 'repeating'].map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => handleChange('occurs', opt)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${formData.occurs === opt
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {opt === 'once' ? 'Once' : 'Repeating'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Room & Building */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Room
                    </label>
                    <input
                        type="text"
                        value={formData.room}
                        onChange={(e) => handleChange('room', e.target.value)}
                        placeholder="e.g. Room 302"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Building
                    </label>
                    <input
                        type="text"
                        value={formData.building}
                        onChange={(e) => handleChange('building', e.target.value)}
                        placeholder="Building name"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* ⭐ New Priority & Tags for Classes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Priority *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {['high', 'medium', 'low'].map(p => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => handleChange('priority', p)}
                                className={`py-3 px-4 rounded-xl font-bold text-xs transition-all ${formData.priority === p
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                    }`}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <Tag size={14} />
                        Tags (Press Enter)
                    </label>
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleAddTag}
                        placeholder="e.g. mandatory, elective"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold flex items-center gap-2">
                            {tag}
                            <X size={14} className="cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                        </span>
                    ))}
                </div>
            )}
        </>
    );

    return (
        <div className="space-y-6">
            {/* ⭐ TAB NAVIGATION */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                    { id: 'task', label: 'Task', icon: '📝' },
                    { id: 'class', label: 'Class', icon: '📚' },
                    { id: 'exam', label: 'Exam', icon: '📄' },
                    { id: 'vacation', label: 'Vacation', icon: '🏖️' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'task' && renderTaskFields()}
                {activeTab === 'exam' && renderExamFields()}
                {activeTab === 'class' && renderClassFields()}
                {activeTab === 'vacation' && (
                    <div className="text-center py-12 text-slate-500">
                        <p className="text-lg">🏖️ Vacation feature coming soon!</p>
                    </div>
                )}

                {/* SUBMIT BUTTON */}
                {activeTab !== 'vacation' && (
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <Plus size={24} strokeWidth={3} />
                                Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                            </>
                        )}
                    </button>
                )}
            </form>
        </div>
    );
};

export default TaskForm;