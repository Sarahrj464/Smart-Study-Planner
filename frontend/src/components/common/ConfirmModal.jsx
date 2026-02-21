import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Trash2, LogOut } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger" // "danger" | "warning" | "info"
}) => {
    if (!isOpen) return null;

    const colors = {
        danger: {
            bg: "bg-rose-50 dark:bg-rose-900/20",
            icon: "text-rose-600 dark:text-rose-500",
            btn: "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20",
            iconComp: <Trash2 size={32} />
        },
        warning: {
            bg: "bg-amber-50 dark:bg-amber-900/20",
            icon: "text-amber-600 dark:text-amber-500",
            btn: "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20",
            iconComp: <AlertCircle size={32} />
        },
        info: {
            bg: "bg-blue-50 dark:bg-blue-900/20",
            icon: "text-blue-600 dark:text-blue-500",
            btn: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20",
            iconComp: <LogOut size={32} />
        }
    };

    const activeColor = colors[type] || colors.danger;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
                >
                    <div className="p-8 text-center">
                        <div className={`w-20 h-20 ${activeColor.bg} rounded-full flex items-center justify-center mx-auto mb-6 ${activeColor.icon}`}>
                            {activeColor.iconComp}
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                            {title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">
                            {message}
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white ${activeColor.btn} shadow-lg transition-all hover:scale-[1.05] active:scale-[0.95]`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmModal;
