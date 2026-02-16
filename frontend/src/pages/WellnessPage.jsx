import { useState, useEffect } from 'react';
import { wellnessService } from '../redux/api/wellnessService';
import { HeartPulse, Trash, Calendar, Smile, Meh, Frown, Angry, Laugh } from 'lucide-react';
import toast from 'react-hot-toast';

const WellnessPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mood, setMood] = useState(3);
    const [note, setNote] = useState('');

    const MOODS = [
        { value: 1, icon: <Angry size={24} />, label: 'Bad', color: 'text-red-500', bg: 'bg-red-50' },
        { value: 2, icon: <Frown size={24} />, label: 'Poor', color: 'text-orange-500', bg: 'bg-orange-50' },
        { value: 3, icon: <Meh size={24} />, label: 'Okay', color: 'text-slate-500', bg: 'bg-slate-50' },
        { value: 4, icon: <Smile size={24} />, label: 'Good', color: 'text-blue-500', bg: 'bg-blue-50' },
        { value: 5, icon: <Laugh size={24} />, label: 'Great', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ];

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await wellnessService.getLogs();
            setLogs(res.data);
        } catch (err) {
            toast.error('Failed to load wellness logs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await wellnessService.createLog({ mood, note });
            setLogs([res.data, ...logs]);
            setNote('');
            setMood(3);
            toast.success('Mood logged! Stay healthy.');
        } catch (err) {
            toast.error('Failed to save log');
        }
    };

    const deleteLog = async (id) => {
        try {
            await wellnessService.deleteLog(id);
            setLogs(logs.filter(log => log._id !== id));
            toast.success('Log deleted');
        } catch (err) {
            toast.error('Failed to delete log');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <HeartPulse size={28} className="text-pink-500" />
                    Wellness Tracker
                </h1>
                <p className="text-slate-500 dark:text-slate-400">Track your mental health alongside your studies.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Log Form */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold mb-4">How are you feeling?</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex justify-between">
                                {MOODS.map((m) => (
                                    <button
                                        key={m.value}
                                        type="button"
                                        onClick={() => setMood(m.value)}
                                        className={`p-2 rounded-xl transition-all ${mood === m.value ? `${m.bg} ${m.color} ring-2 ring-current ring-offset-2 dark:ring-offset-slate-900` : 'text-slate-300 hover:text-slate-400'}`}
                                        title={m.label}
                                    >
                                        {m.icon}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Notes</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="What's on your mind?"
                                    className="w-full h-24 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-500/20"
                            >
                                Log Mood
                            </button>
                        </form>
                    </div>
                </div>

                {/* History */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="font-bold px-2">Recent Logs</h3>
                    <div className="space-y-3">
                        {loading ? (
                            <div className="text-center py-10 text-slate-400">Loading history...</div>
                        ) : logs.length > 0 ? (
                            logs.map((log) => {
                                const moodInfo = MOODS.find(m => m.value === log.mood);
                                return (
                                    <div key={log._id} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex gap-4 animate-in slide-in-from-right-2">
                                        <div className={`p-3 rounded-xl h-fit ${moodInfo?.bg} ${moodInfo?.color}`}>
                                            {moodInfo?.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-slate-400">
                                                    {new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                                </span>
                                                <button onClick={() => deleteLog(log._id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                    <Trash size={14} />
                                                </button>
                                            </div>
                                            <p className="text-sm font-bold mt-1">{moodInfo?.label} Feeling</p>
                                            {log.note && (
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 italic">
                                                    "{log.note}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-20 flex flex-col items-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl text-center">
                                <HeartPulse size={48} className="text-slate-100 dark:text-slate-800 mb-2" />
                                <p className="text-slate-400 text-sm">No logs yet. How's your first day of tracking going?</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WellnessPage;
