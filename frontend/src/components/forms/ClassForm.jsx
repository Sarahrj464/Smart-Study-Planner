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
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ClassForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        course: '',
        teacher: '',
        mode: 'In Person',
        meetingLink: '',
        room: '',
        building: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        dateRangeMode: 'None',
        occurs: 'Repeating',
        repeatDays: [],
        startTime: '09:00',
        endTime: '10:00',
        priority: 'medium',
        tags: [],
    });
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubjectChange = (subject) => {
        setFormData(prev => ({ ...prev, subject, course: '' }));
    };

    const toggleDay = (day) => {
        const days = formData.repeatDays.includes(day)
            ? formData.repeatDays.filter(d => d !== day)
            : [...formData.repeatDays, day];
        handleChange('repeatDays', days);
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                handleChange('tags', [...formData.tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const handleDateModeChange = (mode) => {
        let newEndDate = '';
        if (mode === 'Academic') {
            const date = new Date(formData.startDate || new Date());
            date.setMonth(date.getMonth() + 4);
            newEndDate = date.toISOString().split('T')[0];
        }
        setFormData(prev => ({ ...prev, dateRangeMode: mode, endDate: newEndDate }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        let duration = 60;
        if (formData.startTime && formData.endTime) {
            const [sH, sM] = formData.startTime.split(':');
            const [eH, eM] = formData.endTime.split(':');
            duration = (parseInt(eH) * 60 + parseInt(eM)) - (parseInt(sH) * 60 + parseInt(sM));
            if (duration < 0) duration += 24 * 60;
        }
        try {
            onSubmit({ ...formData, type: 'Class', dueDate: formData.startDate, time: formData.startTime, duration });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-800 dark:text-white placeholder:text-slate-400 outline-none transition-all";
    const courses = formData.subject ? (SUBJECT_COURSES[formData.subject] || []) : [];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Subject */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Subject *</label>
                <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map(s => (
                        <button key={s} type="button" onClick={() => handleSubjectChange(s)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${formData.subject === s
                                ? 'bg-blue-600 text-white border-transparent shadow-md'
                                : 'bg-slate-50 dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course under subject */}
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
                                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-700 hover:border-violet-300'}`}>
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Class Name & Teacher */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Class Name *</label>
                    <input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="e.g. Advanced Calculus" className={inputClass} required />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Teacher</label>
                    <input type="text" value={formData.teacher} onChange={(e) => handleChange('teacher', e.target.value)}
                        placeholder="Teacher name" className={inputClass} />
                </div>
            </div>

            {/* Mode */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Mode</label>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-fit">
                    {['In Person', 'Online'].map((m) => (
                        <button key={m} type="button" onClick={() => handleChange('mode', m)}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${formData.mode === m
                                ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}>
                            {m === 'Online' && <Wifi size={14} />}{m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Meeting Link - Online only */}
            {formData.mode === 'Online' && (
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <Link size={13} /> Meeting Link
                    </label>
                    <input type="url" value={formData.meetingLink} onChange={(e) => handleChange('meetingLink', e.target.value)}
                        placeholder="https://zoom.us/j/... or Google Meet link" className={inputClass} />
                </div>
            )}

            {/* Room & Building - In Person only */}
            {formData.mode === 'In Person' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Room</label>
                        <input type="text" value={formData.room} onChange={(e) => handleChange('room', e.target.value)}
                            placeholder="e.g. Room 302" className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Building</label>
                        <input type="text" value={formData.building} onChange={(e) => handleChange('building', e.target.value)}
                            placeholder="Building name" className={inputClass} />
                    </div>
                </div>
            )}

            {/* Occurs */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Occurs</label>
                <div className="flex gap-3">
                    {['Once', 'Repeating'].map(opt => (
                        <button key={opt} type="button" onClick={() => handleChange('occurs', opt)}
                            className={`px-8 py-3 rounded-xl font-bold transition-all ${formData.occurs === opt
                                ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-500 border border-blue-200 hover:bg-blue-100'}`}>
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Repeat Days */}
            {formData.occurs === 'Repeating' && (
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Repeat Days</label>
                    <div className="flex gap-2 flex-wrap">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <button key={day} type="button" onClick={() => toggleDay(day)}
                                className={`w-12 h-12 rounded-xl text-xs font-bold transition-all ${formData.repeatDays.includes(day)
                                    ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}>
                                {day}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Date Range */}
            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Date Range</label>
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-fit">
                    {[{ id: 'None', label: 'Single Day' }, { id: 'Academic', label: 'Academic Term' }, { id: 'Manual', label: 'Manual' }].map(m => (
                        <button key={m.id} type="button" onClick={() => handleDateModeChange(m.id)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${formData.dateRangeMode === m.id
                                ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
                            {m.label}
                        </button>
                    ))}
                </div>
                {formData.dateRangeMode === 'None' && (
                    <input type="date" value={formData.startDate} onChange={(e) => handleChange('startDate', e.target.value)} className={inputClass} />
                )}
                {(formData.dateRangeMode === 'Academic' || formData.dateRangeMode === 'Manual') && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Start Date</label>
                            <input type="date" value={formData.startDate} onChange={(e) => handleChange('startDate', e.target.value)} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">End Date</label>
                            <input type="date" value={formData.endDate} onChange={(e) => handleChange('endDate', e.target.value)}
                                readOnly={formData.dateRangeMode === 'Academic'} className={inputClass} />
                        </div>
                    </div>
                )}
            </div>

            {/* Start & End Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Start Time *</label>
                    <div onClick={() => setShowStartTimePicker(true)} className={`${inputClass} cursor-pointer flex items-center justify-between`}>
                        {formData.startTime || 'Select Time'}<Clock size={16} className="text-slate-400" />
                    </div>
                    {showStartTimePicker && <TimePicker value={formData.startTime} onChange={(t) => handleChange('startTime', t)} onClose={() => setShowStartTimePicker(false)} />}
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">End Time *</label>
                    <div onClick={() => setShowEndTimePicker(true)} className={`${inputClass} cursor-pointer flex items-center justify-between`}>
                        {formData.endTime || 'Select Time'}<Clock size={16} className="text-slate-400" />
                    </div>
                    {showEndTimePicker && <TimePicker value={formData.endTime} onChange={(t) => handleChange('endTime', t)} onClose={() => setShowEndTimePicker(false)} />}
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
                    placeholder="e.g. mandatory, elective" className={inputClass} />
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
                {loading ? 'Saving...' : '+ Add Class'}
            </button>
        </form>
    );
};

export default ClassForm;