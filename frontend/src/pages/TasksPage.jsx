import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { taskService } from '../redux/api/taskService';
import toast from 'react-hot-toast';
import {
    Plus,
    Calendar as CalendarIcon,
    Clock,
    BookOpen,
    CheckCircle,
    CheckCircle2,
    Circle,
    Trash2,
    X,
    Filter
} from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal';

import TaskForm from '../components/forms/TaskForm';
import ClassForm from '../components/forms/ClassForm';
import ExamForm from '../components/forms/ExamForm';
import VacationForm from '../components/forms/VacationForm';
import TaskItem from '../components/common/TaskItem';

const TASKS_TABS = [
    { id: 'task', label: 'Task' },
    { id: 'class', label: 'Class' },
    { id: 'exam', label: 'Exam' },
    { id: 'vacation', label: 'Vacation' },
    { id: 'xtra', label: 'Xtra' }
];

const SUBJECTS = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Computer Science', 'History', 'Geography', 'English', 'Other'
];

const TasksPage = ({ defaultTab = 'task' }) => {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [showForm, setShowForm] = useState(false);
    const [isDeletingTask, setIsDeletingTask] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    // Update activeTab when defaultTab changes (route change)
    useEffect(() => {
        setActiveTab(defaultTab);
        setShowForm(true); // Auto open form when switching pages if desierd, or keep closed
    }, [defaultTab]);

    const fetchTasks = async () => {
        if (!token) {
            console.warn('No token found, skipping fetchTasks');
            return;
        }
        try {
            setLoading(true);
            const data = await taskService.getTasks();
            setTasks(data.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            if (error.response && error.response.status === 401) {
                toast.error('Session expired. Please login again.');
                dispatch(logout());
                return;
            }
            const message = error.response?.data?.error || error.message || 'Failed to load tasks';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [token]);



    const handleCreateTask = async (taskData) => {
        if (!token) {
            toast.error('You must be logged in to add tasks');
            return;
        }
        try {
            let dataToSend = taskData;
            if (taskData.photo instanceof File) {
                const formData = new FormData();
                // Append all keys
                Object.keys(taskData).forEach(key => {
                    formData.append(key, taskData[key]);
                });
                // Append file as 'image' to match backend middleware
                formData.append('image', taskData.photo);
                dataToSend = formData;
            }

            await taskService.createTask(dataToSend);
            toast.success('Added successfully!');
            setShowForm(false);
            fetchTasks(); // Refresh list
        } catch (error) {
            console.error('Error adding task:', error);
            if (error.response && error.response.status === 401) {
                toast.error('Session expired. Please login again.');
                dispatch(logout());
                return;
            }
            const message = error.response?.data?.error || error.message || 'Failed to add task';
            toast.error(message);
        }
    };

    const handleDeleteRequest = (id) => {
        setTaskToDelete(id);
        setIsDeletingTask(true);
    };

    const handleConfirmDelete = async () => {
        if (!taskToDelete) return;
        try {
            await taskService.deleteTask(taskToDelete);
            toast.success('Deleted successfully');
            setTasks(prev => prev.filter(t => t._id !== taskToDelete));
        } catch (error) {
            toast.error('Failed to delete');
        } finally {
            setIsDeletingTask(false);
            setTaskToDelete(null);
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            const updatedTask = { ...task, completed: !task.completed };
            await taskService.updateTask(task._id, updatedTask);
            setTasks(prev => prev.map(t => t._id === task._id ? updatedTask : t));
            if (updatedTask.completed) toast.success('Marked as complete!');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredTasks = tasks.filter(t => t.type.toLowerCase() === activeTab);

    // Tabs configuration - Validated based on user request (No Xtra)
    const TABS = [
        { id: 'task', label: 'Task' },
        { id: 'class', label: 'Class' },
        { id: 'exam', label: 'Exam' },
        { id: 'vacation', label: 'Vacation' }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white capitalize">{activeTab}s & Schedule</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage your {activeTab}s</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="md:hidden p-3 bg-blue-600 text-white rounded-full shadow-lg"
                >
                    {showForm ? <X size={24} /> : <Plus size={24} />}
                </button>
            </div>

            {/* Tabs & Form Container */}
            <div className="bg-white dark:bg-slate-900 rounded-4xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl w-fit">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm scale-100'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Add Task Form Container */}
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: showForm ? 1 : 0, height: showForm ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    {showForm && (
                        <div className="mt-4">
                            {activeTab === 'task' && <TaskForm onSubmit={handleCreateTask} />}
                            {activeTab === 'class' && <ClassForm onSubmit={handleCreateTask} onCancel={() => setShowForm(false)} />}
                            {activeTab === 'exam' && <ExamForm onSubmit={handleCreateTask} onCancel={() => setShowForm(false)} />}
                            {activeTab === 'vacation' && <VacationForm onSubmit={handleCreateTask} onCancel={() => setShowForm(false)} />}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Task List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <BookOpen size={24} className="text-blue-500" />
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}s
                    <span className="text-sm font-medium text-slate-400 ml-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        {filteredTasks.length}
                    </span>
                </h2>

                <AnimatePresence mode="popLayout">
                    {filteredTasks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 bg-white dark:bg-slate-900 rounded-4xl border border-slate-100 dark:border-slate-800 dashed-border"
                        >
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Filter size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No items found</h3>
                            <p className="text-slate-400">Add a new {activeTab} to get started!</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredTasks.map((task) => (
                                <TaskItem
                                    key={task._id}
                                    task={task}
                                    onToggle={handleToggleComplete}
                                    onDelete={handleDeleteRequest}
                                />
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
            {/* Deletion Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeletingTask}
                onClose={() => {
                    setIsDeletingTask(false);
                    setTaskToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Item?"
                message="Are you sure you want to remove this item? This action will permanently delete it from your records."
                type="danger"
                confirmText="Delete"
            />
        </div>
    );
};

export default TasksPage;
