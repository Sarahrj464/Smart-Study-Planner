import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PomodoroPage from './pages/PomodoroPage';
import TimetablePage from './pages/TimetablePage';
import StudyRoomsPage from './pages/StudyRoomsPage';
import WellnessPage from './pages/WellnessPage';
import BlogPage from './pages/BlogPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AuthGuard from './components/auth/AuthGuard';
import CalendarPage from './pages/CalendarPage';
import TasksPage from './pages/TasksPage';
import GlobalTimer from './components/common/GlobalTimer';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadUser } from './redux/slices/authSlice';


const AppContent = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { loading, token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token) {
            dispatch(loadUser());
        }
    }, [dispatch, token]);

    // Only show global blocking loader if we HAVE a token and are checking its validity
    // If no token, user is a guest/needs to login, don't block the landing page
    if (loading && token) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-blue-100 dark:border-slate-800 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">StudyPulse</h2>
                <p className="text-sm font-medium text-slate-500 animate-pulse">Initializing your space...</p>
            </div>
        );
    }

    // List of paths that should NOT show the main website navbar
    // The DashboardLayout will handle navigation for these
    const dashboardPaths = ['/dashboard', '/pomodoro', '/timetable', '/study-rooms', '/wellness', '/profile', '/settings', '/blog', '/calendar', '/tasks', '/classes', '/exams', '/vacations'];
    const isDashboardRoute = dashboardPaths.some(path => location.pathname.startsWith(path));
    const isHomePage = location.pathname === '/';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
            <GlobalTimer />
            {/* Show Navbar only for landing pages (Home, Blog, etc.) */}
            {!isHomePage && !isDashboardRoute && <Navbar />}

            {/* Wrapper div only needed for non-dashboard pages to add container logic if needed */}
            <div className={!isDashboardRoute && !isHomePage ? 'container mx-auto px-4 py-8' : ''}>
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Protected Dashboard Routes */}
                    <Route element={
                        <AuthGuard>
                            <DashboardLayout />
                        </AuthGuard>
                    }>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/pomodoro" element={<PomodoroPage />} />
                        <Route path="/timetable" element={<TimetablePage />} />
                        <Route path="/study-rooms" element={<StudyRoomsPage />} />
                        <Route path="/wellness" element={<WellnessPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/calendar" element={<CalendarPage />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/classes" element={<TasksPage defaultTab="class" />} />
                        <Route path="/exams" element={<TasksPage defaultTab="exam" />} />
                        <Route path="/vacations" element={<TasksPage defaultTab="vacation" />} />
                        <Route path="/blog" element={<BlogPage />} />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
