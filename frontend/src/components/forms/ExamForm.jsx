import React, { useState } from 'react';
import { BookOpen, User, Calendar, Clock, MapPin, Award } from 'lucide-react';
import TimePicker from '../common/TimePicker';

const ExamForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '', // Exam Name
        subject: 'Mathematics',
        type: 'Exam', // Exam, Quiz, Test
        mode: 'In Person',
        seat: '',
        room: '',
        date: '',
        time: '',
        duration: '',
    });

    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = {
            ...formData,
            type: 'Exam', // Force type
            dueDate: formData.date || new Date(),
        };
        onSubmit(taskData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exam Name & Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Exam *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Exam name"
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Subject *</label>
                    <div className="relative">
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 dark:text-slate-300 appearance-none cursor-pointer"
                        >
                            <option>Mathematics</option>
                            <option>Physics</option>
                            <option>Chemistry</option>
                            <option>Biology</option>
                            <option>Computer Science</option>
                            <option>History</option>
                            <option>English</option>
                            <option>Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                    </div>
                </div>
            </div>

            {/* Type & Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Type</label>
                    <div className="flex bg-white dark:bg-slate-900 p-0 gap-3 rounded-2xl">
                        {['Exam', 'Quiz', 'Test'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setFormData({ ...formData, type: t })}
                                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border ${formData.type === t
                                    ? 'bg-blue-600 text-white border-transparent shadow-md'
                                    : 'bg-blue-50 text-blue-500 border-blue-100 hover:border-blue-300'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Mode</label>
                    <div className="flex bg-white dark:bg-slate-900 p-0 gap-3 rounded-2xl">
                        {['In Person', 'Online'].map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setFormData({ ...formData, mode: m })}
                                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border ${formData.mode === m
                                    ? 'bg-blue-600 text-white border-transparent shadow-md'
                                    : 'bg-blue-50 text-blue-500 border-blue-100 hover:border-blue-300'
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Seat & Room */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Seat</label>
                    <input
                        type="text"
                        name="seat"
                        value={formData.seat}
                        onChange={handleChange}
                        placeholder="Seat #"
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Room</label>
                    <input
                        type="text"
                        name="room"
                        value={formData.room}
                        onChange={handleChange}
                        placeholder="room"
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Date *</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 dark:text-slate-300"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Time *</label>
                    <div
                        onClick={() => setShowTimePicker(true)}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl cursor-pointer font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"
                    >
                        {formData.time || 'Select Time'}
                        <Clock size={16} className="text-slate-400" />
                    </div>
                    {showTimePicker && (
                        <TimePicker
                            value={formData.time}
                            onChange={(time) => setFormData({ ...formData, time })}
                            onClose={() => setShowTimePicker(false)}
                        />
                    )}
                </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Duration (In minutes)</label>
                <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Duration (In minutes)"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400"
                />
            </div>

            <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95"
            >
                Save
            </button>
        </form>
    );
};

export default ExamForm;
