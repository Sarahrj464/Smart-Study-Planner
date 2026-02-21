import { motion } from 'framer-motion';
import { Bell, Moon, Lock, Globe, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/slices/themeSlice';
import WhatsAppSettings from '../components/profile/WhatsAppSettings';

const SettingsPage = () => {
    const { darkMode } = useSelector((state) => state.theme);
    const dispatch = useDispatch();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto space-y-8"
        >
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your application preferences and configurations.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="font-bold text-slate-700 dark:text-slate-200">Appearance</h2>
                </div>
                <div>
                    <div className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                                <Moon size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-slate-200">Dark Mode</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark themes</p>
                            </div>
                        </div>
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${darkMode ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                            <span
                                className={`${darkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                            />
                        </button>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="font-bold text-slate-700 dark:text-slate-200">General</h2>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    <SettingItem
                        icon={<Bell size={20} />}
                        color="text-blue-600"
                        bg="bg-blue-100 dark:bg-blue-900/20"
                        title="Notifications"
                        desc="Manage your daily reminders and alerts"
                    />
                    <SettingItem
                        icon={<Globe size={20} />}
                        color="text-emerald-600"
                        bg="bg-emerald-100 dark:bg-emerald-900/20"
                        title="Language"
                        desc="English (US)"
                    />
                    <SettingItem
                        icon={<Lock size={20} />}
                        color="text-orange-600"
                        bg="bg-orange-100 dark:bg-orange-900/20"
                        title="Privacy & Security"
                        desc="Manage your data and password"
                    />
                </div>
            </motion.div>

            {/* ✅ WhatsApp Notifications Section */}
            <motion.div variants={itemVariants}>
                <div className="mb-3 px-1">
                    <h2 className="font-bold text-slate-700 dark:text-slate-200 text-lg">💬 WhatsApp Notifications</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Receive task reminders and alerts on WhatsApp</p>
                </div>
                <WhatsAppSettings />
            </motion.div>

        </motion.div>
    );
};

const SettingItem = ({ icon, color, bg, title, desc }) => (
    <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left">
        <div className="flex items-center gap-4">
            <div className={`p-2 ${bg} ${color} rounded-lg`}>
                {icon}
            </div>
            <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">{title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
        </div>
        <ChevronRight size={18} className="text-slate-300" />
    </button>
);

export default SettingsPage;