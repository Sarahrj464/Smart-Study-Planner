import React, { useState } from 'react';
import { Clock, Tag, X, Wifi, Link } from 'lucide-react';
import TimePicker from '../common/TimePicker';

const SUBJECT_COURSES = {
    'Mathematics': ['Calculus', 'Linear Algebra', 'Statistics', 'Discrete Math', 'Differential Equations', 'Other'],
    'Physics': ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Quantum Physics', 'Optics', 'Other'],
    'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry', 'Other'],
    'Biology': ['Cell Biology', 'Genetics', 'Ecology', 'Zoology', 'Botany', 'Microbiology', 'Anatomy', 'Other'],
    'Computer Science': ['DSA', 'OOP', 'DBMS', 'Operating Systems', 'Computer Networks', 'Web Development', 'AI/ML', 'Software Engineering', 'Compiler Design', 'Other'],
    'History': ['Ancient History', 'Medieval History', 'Modern History', 'World Wars', 'Pakistan Studies', 'Other'],
    'Geography': ['Physical Geography', 'Human Geography', 'Environmental Studies', 'Other'],
    'English': ['Literature', 'Grammar', 'Creative Writing', 'Communication Skills', 'Other'],
    'Other': ['Other'],
};
const SUBJECTS = Object.keys(SUBJECT_COURSES);

const ExamForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        course: '',
        examType: 'Exam',
        mode: 'In Person',
        meetingLink: '',
        seat: '',
        room: '',
        date: '',
        time: '',
        duration: '',
        priority: 'high',
        tags: [],
    });
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubjectChange = (subject) => setFormData(prev => ({ ...prev, subject, course: '' }));

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) handleChange('tags', [...formData.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            onSubmit({ ...formData, type: formData.examType, dueDate: formData.date || new Date() });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-800 dark:text-white placeholder:text-slate-400 outline-none transition-all";
    const courses = formData.subject ? (SUBJECT_COURSES[formData.subject] || []) : [];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Exam Name */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Exam Name *</label>
                <input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g. Midterm Exam" className={inputClass} required />
            </div>

            {/* Subject */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Subject *</label>
                <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map(s => (
                        <button key={s} type="button" onClick={() => handleSubjectChange(s)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${formData.subject === s
                                ? 'bg-blue-600 text-white border-transparent shadow-md'
                                : 'bg-slate-50 dark:bg-slate-900 text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course */}
            {courses.length > 0 && (
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Course <span className="text-blue-400">({formData.subject})</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {courses.map(c => (
                            <button key={c} type="button" onClick={() => handleChange('course', c)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${formData.course === c
                                    ? 'bg-violet-600 text-white border-transparent shadow-md'
                                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 border-slate-200 hover:border-violet-300'}`}>
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Type & Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Type</label>
                    <div className="flex gap-2">
                        {['Exam', 'Quiz', 'Test'].map(t => (
                            <button key={t} type="button" onClick={() => handleChange('examType', t)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${formData.examType === t
                                    ? 'bg-blue-600 text-white border-transparent shadow-md' : 'bg-blue-50 text-blue-500 border-blue-100 hover:border-blue-300'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Mode</label>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                        {['In Person', 'Online'].map(m => (
                            <button key={m} type="button" onClick={() => handleChange('mode', m)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${formData.mode === m
                                    ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}>
                                {m === 'Online' && <Wifi size={14} />}{m}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Meeting Link - Online only */}
            {formData.mode === 'Online' && (
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <Link size={13} /> Meeting / Exam Portal Link
                    </label>
                    <input type="url" value={formData.meetingLink} onChange={(e) => handleChange('meetingLink', e.target.value)}
                        placeholder="https://zoom.us/j/... or exam portal link" className={inputClass} />
                </div>
            )}

            {/* Seat & Room - In Person only */}
            {formData.mode === 'In Person' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Seat #</label>
                        <input type="text" value={formData.seat} onChange={(e) => handleChange('seat', e.target.value)}
                            placeholder="e.g. A-23" className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Room</label>
                        <input type="text" value={formData.room} onChange={(e) => handleChange('room', e.target.value)}
                            placeholder="e.g. Room 101" className={inputClass} />
                    </div>
                </div>
            )}

            {/* Date, Time, Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Date *</label>
                    <input type="date" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} className={inputClass} required />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Time *</label>
                    <div onClick={() => setShowTimePicker(true)} className={`${inputClass} cursor-pointer flex items-center justify-between`}>
                        {formData.time || 'Select Time'}<Clock size={16} className="text-slate-400" />
                    </div>
                    {showTimePicker && <TimePicker value={formData.time} onChange={(t) => handleChange('time', t)} onClose={() => setShowTimePicker(false)} />}
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Duration (mins)</label>
                    <input type="number" value={formData.duration} onChange={(e) => handleChange('duration', e.target.value)}
                        placeholder="e.g. 120" className={inputClass} />
                </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Priority *</label>
                <div className="grid grid-cols-3 gap-3">
                    {[{ value: 'high', emoji: '🔴', label: 'High', active: 'bg-red-100 border-red-500 text-red-700' },
                      { value: 'medium', emoji: '🟡', label: 'Medium', active: 'bg-yellow-100 border-yellow-500 text-yellow-700' },
                      { value: 'low', emoji: '🟢', label: 'Low', active: 'bg-green-100 border-green-500 text-green-700' }].map(p => (
                        <button key={p.value} type="button" onClick={() => handleChange('priority', p.value)}
                            className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 ${formData.priority === p.value
                                ? p.active : 'bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                            <span className="mr-1">{p.emoji}</span>{p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Tag size={13} /> Tags (Press Enter)
                </label>
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={handleAddTag}
                    placeholder="e.g. final, important, chapter-5" className={inputClass} />
                {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                {tag}<button type="button" onClick={() => handleChange('tags', formData.tags.filter(t => t !== tag))}><X size={12} strokeWidth={3} /></button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <button type="submit" disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95">
                {loading ? 'Saving...' : '+ Add Exam'}
            </button>
        </form>
    );
};

export default ExamForm;