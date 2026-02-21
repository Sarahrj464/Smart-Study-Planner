import React, { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

const VacationForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        details: '',
        startDate: '',
        endDate: '',
        photo: null,
        photoPreview: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        if (e.target.name === 'photo') {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) { setError('File size must be under 5MB'); return; }
            setError('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photo: file, photoPreview: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        }
    };

    const removePhoto = () => setFormData(prev => ({ ...prev, photo: null, photoPreview: null }));

    const getDurationDays = () => {
        if (!formData.startDate || !formData.endDate) return null;
        const diff = new Date(formData.endDate) - new Date(formData.startDate);
        if (diff < 0) return null;
        return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!formData.title.trim()) { setError('Vacation name is required'); return; }
        if (!formData.startDate) { setError('Start date is required'); return; }
        if (!formData.endDate) { setError('End date is required'); return; }
        if (formData.startDate > formData.endDate) { setError('End date must be after start date'); return; }
        setLoading(true);
        try {
            onSubmit({
                title: formData.title.trim(),
                details: formData.details.trim(),
                startDate: formData.startDate,
                endDate: formData.endDate,
                photo: formData.photoPreview || '',
                type: 'Vacation',
                subject: 'Other',
                dueDate: formData.startDate,
                time: '09:00 AM',
            });
        } catch (err) {
            setError('Failed to save. Please try again.');
            setLoading(false);
        }
    };

    const inputClass = "w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-800 dark:text-white placeholder:text-slate-400 outline-none transition-all";
    const duration = getDurationDays();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-2xl text-sm font-bold text-red-600">
                    ⚠️ {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Vacation Name *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange}
                        placeholder="e.g. Summer Break, Eid Holidays" className={inputClass} required />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Details</label>
                    <input type="text" name="details" value={formData.details} onChange={handleChange}
                        placeholder="e.g. Trip to Hunza" className={inputClass} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Start Date *</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={inputClass} required />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">End Date *</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange}
                        min={formData.startDate} className={inputClass} required />
                </div>
            </div>

            {duration && (
                <div className="px-4 py-3 bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-100 flex items-center gap-2">
                    <span className="text-lg">🏖️</span>
                    <p className="text-sm font-bold text-teal-600">{duration} day{duration > 1 ? 's' : ''} vacation</p>
                </div>
            )}

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Photo (Optional)</label>
                {formData.photoPreview ? (
                    <div className="relative rounded-3xl overflow-hidden border-2 border-blue-200 h-48">
                        <img src={formData.photoPreview} alt="Vacation" className="w-full h-full object-cover" />
                        <button type="button" onClick={removePhoto}
                            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-all">
                            <X size={16} className="text-slate-700" />
                        </button>
                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 rounded-full text-xs font-bold text-slate-600 max-w-[70%] truncate">
                            📷 {formData.photo?.name}
                        </div>
                    </div>
                ) : (
                    <div className="relative border-2 border-dashed border-blue-300 bg-blue-50 dark:bg-blue-900/10 w-full h-44 rounded-3xl flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:bg-blue-100 transition-colors">
                        <input type="file" name="photo" onChange={handleChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/jpeg,image/png,image/webp,image/gif" />
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                            <ImageIcon className="text-blue-500" size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-600">Personalize with a photo of your choice</p>
                        <p className="text-xs text-slate-400 mt-1">Max. File Size: 5MB</p>
                    </div>
                )}
            </div>

            <div className="space-y-3 pt-2">
                <button type="submit" disabled={loading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                    {loading ? <><div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> Saving...</> : '🏖️ Add Vacation'}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel}
                        className="w-full py-4 bg-white dark:bg-slate-800 border border-blue-200 text-blue-500 hover:bg-slate-50 rounded-2xl font-bold transition-all">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default VacationForm;