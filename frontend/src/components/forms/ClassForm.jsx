import React, { useState } from 'react';
import { BookOpen, User, Calendar, Clock, MapPin, Repeat, School } from 'lucide-react';
import TimePicker from '../common/TimePicker';

const ClassForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '', // Class Name
        subject: 'Mathematics',
        teacher: '',
        mode: 'In Person',
        room: '',
        building: '',
        startDate: '',
        endDate: '',
        occurs: 'Once', // Start/End Dates mode: None, Academic year/term, Manual
        startTime: '',
        endTime: '',
    });

    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Map simplified form data to backend model
        const taskData = {
            ...formData,
            type: 'Class',
            dueDate: formData.startDate || new Date(), // Fallback
            time: formData.startTime,
            duration: 60, // Calculate from time diff if needed
        };
        onSubmit(taskData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject & Class Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Class</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Class name"
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400"
                        required
                    />
                </div>
            </div>

            {/* Mode & Teacher */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Mode</label>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                        {['In Person', 'Online'].map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setFormData({ ...formData, mode: m })}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formData.mode === m
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Teacher</label>
                    <input
                        type="text"
                        name="teacher"
                        value={formData.teacher}
                        onChange={handleChange}
                        placeholder="Teacher name"
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Start/End Dates */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Start/End Dates</label>

                {/* Re-implementing simplified toggle for visual match */}
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-fit">
                    <button type="button" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-blue-500/20">None</button>
                    <button type="button" className="bg-blue-50 text-blue-500 border border-blue-200 px-6 py-3 rounded-xl font-bold hover:bg-blue-100 transition-all">Academic year/term</button>
                    <button type="button" className="bg-blue-50 text-blue-500 border border-blue-200 px-6 py-3 rounded-xl font-bold hover:bg-blue-100 transition-all">Manual</button>
                </div>
            </div>

            {/* Occurs */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Occurs</label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, occurs: 'Once' })}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${formData.occurs === 'Once' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-500 border border-blue-200'}`}
                    >
                        Once
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, occurs: 'Repeating' })}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${formData.occurs === 'Repeating' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-500 border border-blue-200'}`}
                    >
                        Repeating
                    </button>
                </div>
            </div>

            {/* Room & Building */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Room</label>
                    <input
                        type="text"
                        name="room"
                        value={formData.room}
                        onChange={handleChange}
                        placeholder="Room"
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Building</label>
                    <input
                        type="text"
                        name="building"
                        value={formData.building}
                        onChange={handleChange}
                        placeholder="Building"
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Date</label>
                <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 dark:text-slate-300"
                />
            </div>


            {/* Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Start Time *</label>
                    <div
                        onClick={() => setShowStartTimePicker(true)}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl cursor-pointer font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"
                    >
                        {formData.startTime || 'Select Time'}
                        <Clock size={16} className="text-slate-400" />
                    </div>
                    {showStartTimePicker && (
                        <TimePicker
                            value={formData.startTime}
                            onChange={(time) => setFormData({ ...formData, startTime: time })}
                            onClose={() => setShowStartTimePicker(false)}
                        />
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">End Time *</label>
                    <div
                        onClick={() => setShowEndTimePicker(true)}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl cursor-pointer font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"
                    >
                        {formData.endTime || 'Select Time'}
                        <Clock size={16} className="text-slate-400" />
                    </div>
                    {showEndTimePicker && (
                        <TimePicker
                            value={formData.endTime}
                            onChange={(time) => setFormData({ ...formData, endTime: time })}
                            onClose={() => setShowEndTimePicker(false)}
                        />
                    )}
                </div>
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

export default ClassForm;
