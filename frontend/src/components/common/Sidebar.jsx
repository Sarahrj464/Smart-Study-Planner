import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import {
    LayoutDashboard,
    Timer,
    Calendar,
    Users,
    HeartPulse,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Settings,
    BookOpen,
    CalendarDays,
    Plus,
    GraduationCap,
    Palmtree,
    Trophy
} from 'lucide-react';
import logo from '../../assets/logo.png';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import LogoutModal from './LogoutModal';
import MiniCalendar from './MiniCalendar';

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [isActivitiesOpen, setIsActivitiesOpen] = useState(true);

    const handleLogout = () => {
        dispatch(logout());
        setShowLogoutModal(false);
        // Force a full page refresh to completely wipe all application state (React state, Redux, etc.)
        // This ensures a 100% clean slate for the next user session.
        window.location.href = '/';
    };

    const toggleActivities = () => {
        setIsActivitiesOpen(!isActivitiesOpen);
    };

    const activityItems = [
        { path: '/tasks', icon: <BookOpen size={22} />, label: 'Tasks' },
        { path: '/exams', icon: <GraduationCap size={22} />, label: 'Exam' },
        { path: '/classes', icon: <Users size={22} />, label: 'Classes' },
        { path: '/vacations', icon: <Palmtree size={22} />, label: 'Vacations' },
    ];

    const mainNavItems = [
        { path: '/dashboard', icon: <LayoutDashboard size={22} />, label: 'Dashboard' },
        { path: '/calendar', icon: <Calendar size={22} />, label: 'Calendar' },
    ];

    const otherNavItems = [
        { path: '/pomodoro', icon: <Timer size={22} />, label: 'Focus' },
        { path: '/timetable', icon: <CalendarDays size={22} />, label: 'Timetable' },
        { path: '/study-rooms', icon: <Users size={22} />, label: 'Rooms' },
        { path: '/wellness', icon: <HeartPulse size={22} />, label: 'Health' },
        { path: '/blog', icon: <BookOpen size={22} />, label: 'Blog' },
    ];

    return (
        <>
            <aside
                className={`h-screen sticky top-0 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-50 ${collapsed ? 'w-20' : 'w-72'
                    }`}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-center border-b border-slate-200 dark:border-slate-800 relative">
                    <Link to="/" className={`flex items-center gap-3 overflow-hidden px-6 w-full ${collapsed ? 'justify-center' : ''}`}>
                        <div className="flex items-center gap-3">
                            <img
                                src={logo}
                                alt="StudyPulse"
                                className="h-14 min-w-[48px] object-contain"
                            />
                            <span className={`font-heading text-2xl font-black tracking-tight transition-all duration-300 text-blue-600 dark:text-blue-500 whitespace-nowrap ${collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
                                }`}>
                                StudyPulse
                            </span>
                        </div>
                    </Link>

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors border border-white dark:border-slate-900 z-10"
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav
                    className="flex-1 py-4 px-3 space-y-2 overflow-y-auto font-sans"
                    style={{ scrollbarWidth: 'thin' }}
                >
                    {/* Main Items */}
                    {mainNavItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                    } ${collapsed ? 'justify-center' : ''}`}
                            >
                                <div className="relative z-10 flex items-center gap-3 font-medium">
                                    <div className={`${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'}`}>
                                        {item.icon}
                                    </div>
                                    <span className={`font-bold text-base whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden hidden' : 'opacity-100'}`}>
                                        {item.label}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}

                    {/* Activities Collapsible Button */}
                    <div>
                        <button
                            onClick={toggleActivities}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActivitiesOpen && !collapsed
                                ? 'text-slate-700 dark:text-slate-200'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                } ${collapsed ? 'justify-center' : ''}`}
                        >
                            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'flex-1'}`}>
                                <div className={`${isActivitiesOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'}`}>
                                    <LayoutDashboard size={22} />
                                </div>
                                <span className={`font-bold text-base whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden hidden' : 'opacity-100'}`}>
                                    Activities
                                </span>
                            </div>
                            {!collapsed && (
                                <ChevronRight
                                    size={18}
                                    className={`transition-transform duration-200 text-slate-400 ${isActivitiesOpen ? 'rotate-90 text-blue-500' : ''}`}
                                />
                            )}
                        </button>

                        <AnimatePresence>
                            {(!collapsed && isActivitiesOpen) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden space-y-1 pl-4 mt-1"
                                >
                                    {activityItems.map((item) => {
                                        const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard'); // Handle default
                                        const isSubActive = location.pathname === item.path;
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isSubActive
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 text-sm font-bold">
                                                    <div className={`${isSubActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 transition-colors'}`}>
                                                        {item.icon}
                                                    </div>
                                                    <span>{item.label}</span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Other Items */}
                    {otherNavItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                    } ${collapsed ? 'justify-center' : ''}`}
                            >
                                <div className="relative z-10 flex items-center gap-3 font-medium">
                                    <div className={`${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'}`}>
                                        {item.icon}
                                    </div>
                                    <span className={`font-bold text-base whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden hidden' : 'opacity-100'}`}>
                                        {item.label}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}

                    {/* Sidebar Calendar - Only visible when expanded */}
                    {!collapsed && (
                        <div className="pt-4 animate-in fade-in duration-500">
                            <MiniCalendar />
                        </div>
                    )}
                </nav>

                {/* Add New Button (Fixed Section) */}
                <div className="px-4 py-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-4">
                    <div className="relative flex justify-center">
                        <button
                            onClick={() => setShowAddMenu(!showAddMenu)}
                            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 group ${collapsed ? 'justify-center' : ''}`}
                        >
                            <Plus size={22} strokeWidth={3} />
                            <span className={`font-bold text-base whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                                Add New
                            </span>
                        </button>

                        <AnimatePresence>
                            {showAddMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className={`absolute left-0 right-0 bottom-full mb-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-[60] origin-bottom ${collapsed ? 'w-48 left-0' : ''}`}
                                >
                                    {[
                                        { label: 'Task', path: '/tasks' },
                                        { label: 'Class', path: '/classes' },
                                        { label: 'Exam', path: '/exams' },
                                        { label: 'Vacation', path: '/vacations' }
                                    ].map((item) => (
                                        <Link
                                            key={item.label}
                                            to={item.path}
                                            onClick={() => setShowAddMenu(false)}
                                            className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:text-blue-600 transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4 bg-slate-50 dark:bg-slate-950">
                    <div className={`flex items-center justify-between ${collapsed ? 'flex-col gap-4' : ''}`}>
                        <ThemeToggle />
                    </div>

                    <Link to="/profile" className={`flex items-center gap-3 px-3 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-colors group ${collapsed ? 'justify-center p-2' : ''}`}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform overflow-hidden">
                            {user?.profilePicture && user.profilePicture !== 'default-avatar.png' ? (
                                <img
                                    src={user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:5003${user.profilePicture}`}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                user?.name?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 ml-1'}`}>
                            <p className="text-sm font-bold truncate text-slate-700 dark:text-slate-200">{user?.name}</p>
                            <p className="text-xs uppercase font-bold text-slate-400 truncate tracking-wider">Student</p>
                        </div>
                    </Link>

                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className={`flex items-center gap-3 px-3 py-3 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all group ${collapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                        <span className={`font-bold text-sm transition-all duration-300 ${collapsed ? 'w-0 opacity-0 overflow-hidden hidden' : 'w-auto opacity-100'}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />
        </>
    );
};

export default Sidebar;
