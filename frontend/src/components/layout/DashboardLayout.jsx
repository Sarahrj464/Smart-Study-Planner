import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import { Settings, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

const DashboardLayout = () => {
    const { user } = useSelector((state) => state.auth);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    };

    return (
        <div className="flex min-h-screen bg-[#f0f7ff] dark:bg-slate-950">
            <Sidebar />
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden transition-all">
                {/* Top Bar */}
                <header className="h-20 px-6 md:px-8 flex items-center justify-between bg-[#f0f7ff]/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 border-b border-blue-100/50 dark:border-slate-800">
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {formatTime(currentTime)}
                        </span>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            {formatDate(currentTime)}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/settings"
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm"
                            aria-label="Settings"
                        >
                            <Settings size={20} />
                        </Link>

                        <Link
                            to="/profile"
                            className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-colors">
                                <User size={18} />
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">
                                    {user?.name || 'Student'}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                                    {user?.email}
                                </p>
                            </div>
                        </Link>
                    </div>
                </header>

                <div className="flex-1 overflow-x-hidden p-6 md:p-8 overflow-y-auto">
                    <div className="w-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
