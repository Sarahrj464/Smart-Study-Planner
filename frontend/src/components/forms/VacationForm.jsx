import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const VacationForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '', // Vacation Name
        details: '',
        startDate: '',
        endDate: '',
        photo: null // Placeholder
    });

    const handleChange = (e) => {
        if (e.target.name === 'photo') {
            setFormData({ ...formData, photo: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = {
            ...formData,
            type: 'Vacation',
            subject: 'Other', // Default
            dueDate: formData.startDate || new Date(),
            time: '12:00 AM' // Default
        };
        onSubmit(taskData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Name *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Vacations name"
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Details</label>
                    <input
                        type="text"
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        placeholder="Vacations description"
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Start/End Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Start Date *</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 dark:text-slate-300"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">End Date *</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 dark:text-slate-300"
                    />
                </div>
            </div>

            {/* Photo Upload Placeholder */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Photo</label>
                </div>
                <div className="relative border-2 border-dashed border-blue-300 bg-blue-50 w-full h-40 rounded-3xl flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:bg-blue-100 transition-colors">
                    <input
                        type="file"
                        name="photo"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                    />
                    {formData.photo ? (
                        <div className="flex flex-col items-center">
                            <ImageIcon className="text-blue-500 mb-2" size={24} />
                            <p className="text-sm font-bold text-blue-600">{formData.photo.name}</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                <ImageIcon className="text-blue-500" size={24} />
                            </div>
                            <p className="text-sm font-bold text-slate-600">Personalize with a photo of your choice</p>
                            <p className="text-xs text-slate-400 mt-1">Max. File Size: 5MB</p>
                        </>
                    )}
                </div>
            </div>

            <div className="space-y-3 pt-4">
                <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                >
                    Save
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full py-4 bg-white border border-blue-200 text-blue-500 hover:bg-slate-50 rounded-2xl font-bold transition-all"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default VacationForm;
