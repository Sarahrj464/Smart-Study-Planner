import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, Trash2, Edit2, ChevronRight, Clock, AlertCircle, CheckCircle, Flame } from 'lucide-react';
import LogoutModal from '../components/common/LogoutModal';
import EditProfileModal from '../components/profile/EditProfileModal';
import { logout } from '../redux/slices/authSlice';
import { dashboardService } from '../redux/api/dashboardService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchProfileStats = async () => {
            try {
                const data = await dashboardService.getStats();
                // stats from dashboardService.getStats() returns { success: true, data: { user, analytics } }
                if (data && data.data) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch profile stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileStats();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        setShowLogoutModal(false);
    };

    const handleDeleteAccount = async () => {
        toast.success("Account deleted successfully");
        dispatch(logout());
        navigate('/');
    };

    // Derived stats
    const taskStats = stats?.user?.taskStats || { pending: 0, overdue: 0, completed: 0 };
    const streak = stats?.user?.studyStats?.streak || 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto space-y-8 pb-12 px-4"
        >
            {/* Header / Avatar */}
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center space-y-4 pt-4">
                <div className="relative group cursor-pointer" onClick={() => setShowEditModal(true)}>
                    <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-3xl font-black text-blue-600 border-4 border-white shadow-2xl overflow-hidden relative z-10">
                        {user?.profilePicture && user.profilePicture !== 'default-avatar.png' ? (
                            <img
                                src={user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:5000${user.profilePicture}`}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            user?.name?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2.5 border-4 border-white text-white transition-transform group-hover:scale-110 shadow-lg z-20">
                        <Edit2 size={14} fill="white" />
                    </div>
                    {/* Dotted circle decoration */}
                    <div className="absolute -inset-4 border-2 border-dashed border-blue-200 rounded-full animate-spin-slow pointer-events-none" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">{user?.name}</h1>
                    <p className="text-sm font-bold text-slate-400">{user?.email}</p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Clock className="text-amber-500" size={24} />}
                    bg="bg-amber-50/50"
                    label="Pending Tasks"
                    value={loading ? "..." : taskStats.pending}
                    sub="Last 7 days"
                    color="text-amber-600"
                />
                <StatCard
                    icon={<AlertCircle className="text-rose-500" size={24} />}
                    bg="bg-rose-50/50"
                    label="Overdue Tasks"
                    value={loading ? "..." : taskStats.overdue}
                    sub="Total"
                    color="text-rose-600"
                />
                <StatCard
                    icon={<CheckCircle className="text-emerald-500" size={24} />}
                    bg="bg-emerald-50/50"
                    label="Tasks Completed"
                    value={loading ? "..." : taskStats.completed}
                    sub="Last 7 days"
                    color="text-emerald-600"
                />
                <StatCard
                    icon={<Flame className="text-orange-500" size={24} />}
                    bg="bg-orange-50/50"
                    label="Your Streak"
                    value={loading ? "..." : streak}
                    sub="Total streak"
                    color="text-orange-600"
                />
            </motion.div>

            {/* Settings Menu */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-lg shadow-slate-200/50 transition-all hover:shadow-xl hover:shadow-blue-500/10 group">
                    <MenuItem
                        icon={<LogOut size={24} />}
                        label="Log out"
                        color="text-blue-600"
                        onClick={() => setShowLogoutModal(true)}
                    />
                </div>
                <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-lg shadow-slate-200/50 transition-all hover:shadow-xl hover:shadow-rose-500/10 group">
                    <MenuItem
                        icon={<Trash2 size={24} />}
                        label="Delete Account"
                        color="text-rose-600"
                        onClick={() => setShowDeleteModal(true)}
                    />
                </div>
            </motion.div>

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />

            <LogoutModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account"
                message="Are you sure you want to delete your account? This action cannot be undone."
                confirmText="Delete Account"
            />

            <EditProfileModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
            />
        </motion.div>
    );
};

const StatCard = ({ icon, bg, label, value, sub, color }) => (
    <div className={`p-6 rounded-2xl ${bg} border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between min-h-[140px] transition-transform hover:scale-[1.02]`}>
        <div className="flex items-center gap-2 mb-2">
            {icon}
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{label}</span>
        </div>
        <div>
            <span className={`text-4xl font-bold ${color}`}>{value}</span>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
        </div>
    </div>
);

const MenuItem = ({ icon, label, color, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
    >
        <div className="flex items-center gap-4">
            <div className={`${color === 'text-red-500' ? 'text-red-500' : 'text-blue-600'}`}>
                {icon}
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200">{label}</span>
        </div>
        <ChevronRight size={18} className="text-slate-300" />
    </button>
);

export default ProfilePage;
