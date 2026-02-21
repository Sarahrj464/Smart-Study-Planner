import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import ThemeToggle from './ThemeToggle';
import { LogOut, User, LayoutDashboard, Timer, Calendar, Users, HeartPulse, BookOpen } from 'lucide-react';
import logo from '../../assets/logo.png';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="bg-sky-50/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-sky-100/50 dark:border-slate-800 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-[1600px] mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
                <Link
                    to="/"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex items-center gap-3 group"
                >
                    <div className="relative">
                        <img
                            src={logo}
                            alt="StudyPulse Logo"
                            className="h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
                        />
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="font-heading text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-500">
                        StudyPulse
                    </span>
                </Link>

                <div className="hidden lg:flex items-center space-x-10">
                    <NavLink to="/" icon={<LayoutDashboard size={18} />} label="Home" isHome />
                    {isAuthenticated && (
                        <div className="flex items-center space-x-6 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                            <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                            <NavLink to="/pomodoro" icon={<Timer size={18} />} label="Focus" />
                            <NavLink to="/timetable" icon={<Calendar size={18} />} label="Schedule" />
                            <NavLink to="/study-rooms" icon={<Users size={18} />} label="Rooms" />
                            <NavLink to="/wellness" icon={<HeartPulse size={18} />} label="Health" />
                        </div>
                    )}
                    <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden lg:block" />
                    <NavLink to="/blog" icon={<BookOpen size={18} />} label="Blog" />
                </div>

                <div className="flex items-center space-x-4">
                    <ThemeToggle />

                    <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-2" />

                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-500/30">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white hidden sm:inline">{user?.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/signup"
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all text-sm font-black shadow-lg shadow-blue-500/25"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, label, isHome }) => (
    <Link
        to={to}
        onClick={isHome ? () => window.scrollTo({ top: 0, behavior: 'smooth' }) : undefined}
        className="flex items-center space-x-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-sm font-bold rounded-xl hover:bg-white dark:hover:bg-slate-900 group"
    >
        <div className="group-hover:scale-110 transition-transform">{icon}</div>
        <span>{label}</span>
    </Link>
);

export default Navbar;
