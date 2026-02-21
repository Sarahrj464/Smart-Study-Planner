import React, { useState, useEffect } from 'react';
import apiClient from '../../redux/api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Smartphone, Bell, Save, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

const WhatsAppSettings = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [prefs, setPrefs] = useState({
        reminders: true,
        dailySummary: true,
        overdueAlerts: true
    });
    const [loading, setLoading] = useState(false);
    const [testLoading, setTestLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await apiClient.get('/notifications/settings');
            if (res.data.success) {
                setPhoneNumber(res.data.data.phoneNumber || '');
                if (res.data.data.notificationPrefs) {
                    setPrefs(res.data.data.notificationPrefs);
                }
            }
        } catch (error) {
            console.error('Settings fetch error:', error);
        }
    };

    const saveSettings = async () => {
        if (!phoneNumber) {
            setMessage({ text: '⚠️ Please enter your phone number!', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            const res = await apiClient.put('/notifications/settings', {
                phoneNumber,
                notificationPrefs: prefs
            });
            if (res.data.success) {
                setMessage({ text: '✅ Settings saved successfully!', type: 'success' });
            }
        } catch (error) {
            setMessage({ text: '❌ Error saving settings', type: 'error' });
        }
        setLoading(false);
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const sendTestMessage = async () => {
        if (!phoneNumber) {
            setMessage({ text: '⚠️ Please save your phone number first!', type: 'error' });
            return;
        }
        setTestLoading(true);
        try {
            const res = await apiClient.post('/notifications/test');
            if (res.data.success) {
                setMessage({ text: '✅ Test message sent! Please check your WhatsApp 📱', type: 'success' });
            } else {
                setMessage({ text: `❌ ${res.data.message}`, type: 'error' });
            }
        } catch (error) {
            setMessage({ text: '❌ Test message failed', type: 'error' });
        }
        setTestLoading(false);
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    };

    const togglePref = (key) => {
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] max-w-lg mx-auto overflow-hidden relative"
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-emerald-50 rounded-[22px] flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/20">
                    <Smartphone size={28} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">WhatsApp Notifications</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Connected via Green API</p>
                </div>
                <div className="ml-auto px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/30">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Active
                </div>
            </div>

            {/* Phone Number Area */}
            <div className="space-y-3 mb-8">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">
                    Phone Number (Pakistan)
                </label>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                        <span className="text-lg">🇵🇰</span>
                        <span className="text-sm">+92</span>
                    </div>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        placeholder="3001234567"
                        className="flex-1 px-5 py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-emerald-500 focus:ring-0 transition-all outline-none font-bold text-sm tracking-wide shadow-sm"
                    />
                </div>
                <p className="text-[10px] font-bold text-slate-400 px-1 italic opacity-80">
                    Example: 3001234567 (without leading 0)
                </p>
            </div>

            {/* Preferences Area */}
            <div className="space-y-3 mb-10">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Bell size={14} className="text-emerald-500" />
                    Notification Preferences
                </label>

                <div className="space-y-2.5">
                    {[
                        { key: 'reminders', icon: '⏰', label: 'Task Reminders', desc: '30 min before alert', color: 'bg-blue-50 text-blue-500' },
                        { key: 'dailySummary', icon: '📊', label: 'Daily Summary', desc: 'Daily at 9:00 AM', color: 'bg-purple-50 text-purple-500' },
                        { key: 'overdueAlerts', icon: '⚠️', label: 'Overdue Alerts', desc: 'When tasks are overdue', color: 'bg-amber-50 text-amber-500' },
                    ].map(item => (
                        <motion.div
                            key={item.key}
                            whileHover={{ x: 5, scale: 1.01 }}
                            onClick={() => togglePref(item.key)}
                            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group transition-all cursor-pointer shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                                <div>
                                    <div className="text-sm font-black text-slate-800 dark:text-white tracking-tight">{item.label}</div>
                                    <div className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500 transition-colors uppercase tracking-wider">{item.desc}</div>
                                </div>
                            </div>

                            {/* Modern Toggle */}
                            <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${prefs[item.key] ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                <motion.div
                                    animate={{ x: prefs[item.key] ? 24 : 4 }}
                                    className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-md"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Feedback Messages */}
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`overflow-hidden mb-6`}
                    >
                        <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-[13px] border shadow-sm ${message.type === 'success'
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/10 dark:border-emerald-800/30'
                            : 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-900/10 dark:border-rose-800/30'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            {message.text}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Actions Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <motion.button
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveSettings}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[20px] font-black text-[13px] uppercase tracking-widest shadow-xl shadow-slate-200 dark:shadow-none transition-all disabled:opacity-50"
                >
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save size={18} /> Save Settings</>}
                </motion.button>
                <motion.button
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={sendTestMessage}
                    disabled={testLoading}
                    className="flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-[20px] font-black text-[13px] uppercase tracking-widest shadow-xl shadow-emerald-200 dark:shadow-none transition-all disabled:opacity-50"
                >
                    {testLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={18} /> Test Message</>}
                </motion.button>
            </div>

            {/* Footer Tip */}
            <div className="mt-8 text-center">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] italic">Settings sync automatically with backend</p>
            </div>
        </motion.div>
    );
};

export default WhatsAppSettings;