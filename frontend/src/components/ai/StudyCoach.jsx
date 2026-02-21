// frontend/src/components/ai/StudyCoach.jsx

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Zap, FileText, Check } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchTasks } from "../../redux/slices/taskSlice";
import SyllabusUpload from "../profile/SyllabusUpload";
import toast from "react-hot-toast";

const API_URL = 'http://localhost:5003/api/v1';

function isAddRequest(text) {
    const keywords = ['add', 'create', 'schedule', 'set', 'make', 'jodo', 'daalo', 'lagao',
        'quiz', 'exam', 'assignment', 'task', 'class', 'lecture', 'test',
        'krna', 'karo', 'chahta', 'chahti', 'karwa'];
    return keywords.some(k => text.toLowerCase().includes(k));
}

function isDeleteRequest(text) {
    const keywords = ['delete', 'remove', 'hata', 'hatao', 'cancel', 'drop'];
    return keywords.some(k => text.toLowerCase().includes(k));
}

const AddedTasksList = ({ tasks }) => (
    <div className="mt-2 space-y-1.5">
        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest ml-1">✅ Tasks Added Successfully</p>
        {tasks.map((task, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5"
            >
                <Check size={14} className="text-emerald-500 shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">{task.title}</p>
                    <p className="text-xs text-slate-400">
                        {task.type} • {task.priority} priority
                        {task.dueDate && ` • Due: ${new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                    </p>
                </div>
            </motion.div>
        ))}
    </div>
);

const PrioritySuggestions = ({ tasks }) => {
    if (!tasks?.length) return null;
    const sorted = [...tasks].sort((a, b) => {
        const order = { High: 0, Medium: 1, Low: 2 };
        return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
    });
    return (
        <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-2">📋 Priority Order — Do These First:</p>
            {sorted.map((task, i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-600' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                        {task.priority}
                    </span>
                    <span className="text-xs font-bold text-slate-600">{task.title}</span>
                    {task.dueDate && <span className="text-[10px] text-slate-400 ml-auto">Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                </div>
            ))}
        </div>
    );
};

export default function StudyCoach() {
    const dispatch = useDispatch(); // ✅ Redux dispatch
    const [activeTab, setActiveTab] = useState("chat");
    const [messages, setMessages] = useState([{
        role: "assistant",
        content: `👋 Hi! I'm your AI Study Coach! 🚀\n\nI can:\n• Answer study questions & guide you\n• Automatically add tasks, quizzes, exams & assignments\n• Delete tasks when you ask\n• Show priority order after adding\n\nTry:\n"Add Physics quiz Friday, Math exam Monday"\n"Create OOP assignment due tomorrow"\n"Delete my Networks quiz"`,
        addedTasks: [],
        showPriority: false,
    }]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const getToken = () => localStorage.getItem('token');

    const fetchAllTasks = async () => {
        try {
            const res = await fetch(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            return data.data || data || [];
        } catch (e) { return []; }
    };

    const addTask = async (taskData) => {
        const res = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify(taskData)
        });
        const data = await res.json();
        return data.data || data;
    };

    const deleteTask = async (taskId) => {
        await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${getToken()}` }
        });
    };

    // ✅ Refresh Redux store + all pages
    const refreshAll = () => {
        dispatch(fetchTasks());
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage, addedTasks: [], showPriority: false }]);
        setLoading(true);

        try {
            const allTasks = await fetchAllTasks();
            const pendingTasks = allTasks.filter(t => !t.completed);
            const overdueTasks = allTasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date());
            const examTasks = pendingTasks.filter(t => t.type === 'exam');

            const wantsAdd = isAddRequest(userMessage);
            const wantsDelete = isDeleteRequest(userMessage);
            const today = new Date().toISOString().split('T')[0];
            const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            let aiReply = '';
            let addedTasks = [];
            let showPriority = false;

            // ============================================
            // ✅ DELETE REQUEST
            // ============================================
            if (wantsDelete) {
                const deletePrompt = `You are an AI assistant. Today is ${today}.
Student wants to delete a task.

Current tasks:
${pendingTasks.map((t, i) => `${i + 1}. ID: "${t._id}" | Title: "${t.title}" | Type: ${t.type} | Priority: ${t.priority}`).join('\n') || 'No tasks found'}

Student message: "${userMessage}"

Find matching task(s) and return ONLY this JSON:
{
  "message": "Confirmation message that task was deleted. Mention the task name. Add 1 study tip.",
  "deleteIds": ["exact_task_id_here"]
}

If no match:
{
  "message": "Could not find that task. Your current tasks are: [list titles]",
  "deleteIds": []
}

Return ONLY JSON.`;

                const res = await fetch(`${API_URL}/ai/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                    body: JSON.stringify({ question: userMessage, customSystemPrompt: deletePrompt })
                });
                const data = await res.json();

                try {
                    const cleaned = data.reply.replace(/```json|```/g, '').trim();
                    const parsed = JSON.parse(cleaned);
                    if (parsed.deleteIds?.length > 0) {
                        await Promise.all(parsed.deleteIds.map(id => deleteTask(id)));
                        // ✅ Refresh Redux + pages
                        refreshAll();
                        toast.success(`🗑️ Task deleted!`, { icon: '🗑️' });
                    }
                    aiReply = parsed.message || 'Task deleted!';
                } catch (e) {
                    aiReply = data.reply;
                }
            }

            // ============================================
            // ✅ ADD REQUEST
            // ============================================
            else if (wantsAdd) {
                // Calculate next weekday dates
                const getNextDay = (dayName) => {
                    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                    const today = new Date();
                    const targetDay = days.indexOf(dayName);
                    if (targetDay === -1) return threeDaysLater;
                    let daysUntil = targetDay - today.getDay();
                    if (daysUntil <= 0) daysUntil += 7;
                    const result = new Date(today);
                    result.setDate(today.getDate() + daysUntil);
                    return result.toISOString().split('T')[0];
                };

                const addPrompt = `You are an AI study assistant. Today is ${today} (${new Date().toLocaleDateString('en-US', {weekday:'long'})}).

Next weekday dates:
- Monday: ${getNextDay('Monday')}
- Tuesday: ${getNextDay('Tuesday')}
- Wednesday: ${getNextDay('Wednesday')}
- Thursday: ${getNextDay('Thursday')}
- Friday: ${getNextDay('Friday')}
- Saturday: ${getNextDay('Saturday')}
- Sunday: ${getNextDay('Sunday')}
- Tomorrow: ${new Date(Date.now() + 1*24*60*60*1000).toISOString().split('T')[0]}
- Next week: ${new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0]}

Student message: "${userMessage}"

Extract ALL tasks and return ONLY this JSON (no markdown):
{
  "message": "Short friendly confirmation (1 sentence)",
  "tasks": [
    {
      "title": "Clear descriptive task title",
      "type": "task|quiz|exam|class|assignment",
      "subject": "Subject name or General",
      "priority": "High|Medium|Low",
      "dueDate": "YYYY-MM-DD"
    }
  ]
}

Rules:
- type: quiz/test→quiz, exam/final/midterm→exam, assignment/hw/homework→assignment, class/lecture→class, else→task
- priority: today/tomorrow→High, this week→Medium, next week+→Low, not mentioned→Medium
- Extract EVERY task mentioned
- Return ONLY JSON, nothing else`;

                const res = await fetch(`${API_URL}/ai/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                    body: JSON.stringify({ question: userMessage, customSystemPrompt: addPrompt })
                });
                const data = await res.json();

                try {
                    const cleaned = data.reply.replace(/```json|```/g, '').trim();
                    const parsed = JSON.parse(cleaned);

                    if (parsed.tasks?.length > 0) {
                        // ✅ Add all tasks
                        const results = await Promise.allSettled(
                            parsed.tasks.map(task => addTask({
                                title: task.title,
                                type: task.type || 'task',
                                subject: task.subject || 'General',
                                priority: task.priority || 'Medium',
                                dueDate: task.dueDate
                                    ? new Date(task.dueDate).toISOString()
                                    : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
                            }))
                        );

                        addedTasks = parsed.tasks
                            .map((task, i) => ({ ...task, success: results[i].status === 'fulfilled' }))
                            .filter(t => t.success);

                        // ✅ Refresh Redux store so all pages update instantly
                        refreshAll();

                        // ✅ Toast for each added task
                        addedTasks.forEach(task => {
                            toast.success(`✅ ${task.title} added!`, { duration: 2000 });
                        });

                        const updatedTasks = await fetchAllTasks();
                        const updatedPending = updatedTasks.filter(t => !t.completed);

                        aiReply = `${parsed.message || `Done!`}\n\nYou now have ${updatedPending.length} pending tasks. Start with High priority tasks first! 👇`;
                        showPriority = true;
                    }
                } catch (e) {
                    aiReply = data.reply;
                }
            }

            // ============================================
            // ✅ NORMAL CHAT
            // ============================================
            else {
                const res = await fetch(`${API_URL}/ai/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                    body: JSON.stringify({
                        question: userMessage,
                        tasks: allTasks.slice(0, 10).map(t => ({
                            title: t.title, subject: t.subject, priority: t.priority,
                            dueDate: t.dueDate, completed: t.completed, type: t.type
                        })),
                        exams: examTasks.map(e => e.title).join(', ') || 'None',
                        hoursToday: 0,
                        streak: 0,
                        urgentTasks: overdueTasks.length,
                        pendingCount: pendingTasks.length,
                    })
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.reply || 'AI failed');
                aiReply = data.reply;
            }

            setMessages(prev => [...prev, {
                role: "assistant",
                content: aiReply,
                addedTasks,
                showPriority,
            }]);

        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "❌ Something went wrong. Please try again.",
                addedTasks: [], showPriority: false
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const quickQuestions = [
        "Add Physics quiz Friday & Math exam Monday",
        "Create OOP assignment due tomorrow High priority",
        "How should I prioritize my tasks today?",
        "Delete my Networks quiz",
    ];

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-6 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Sparkles className="text-white" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">AI Study Coach</h2>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Always Ready</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-3 gap-6">
                <button onClick={() => setActiveTab("chat")} className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === "chat" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                    <Bot size={16} /> AI Chat
                </button>
                <button onClick={() => setActiveTab("syllabus")} className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === "syllabus" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                    <FileText size={16} /> Upload Syllabus
                </button>
            </div>

            {activeTab === "syllabus" && <div className="flex-1 overflow-y-auto p-6"><SyllabusUpload /></div>}

            {activeTab === "chat" && (
                <>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        <AnimatePresence>
                            {messages.map((msg, index) => (
                                <motion.div key={index} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.2 }}
                                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.role === "assistant" && (
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-md mt-1">
                                            <Bot size={16} className="text-white" />
                                        </div>
                                    )}
                                    <div className="flex flex-col max-w-[85%]">
                                        <div className={`rounded-[20px] px-5 py-3.5 shadow-sm text-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none font-medium" : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-tl-none font-medium"}`}>
                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                        </div>
                                        {msg.addedTasks?.length > 0 && <AddedTasksList tasks={msg.addedTasks} />}
                                        {msg.showPriority && msg.addedTasks?.length > 0 && <PrioritySuggestions tasks={msg.addedTasks} />}
                                    </div>
                                    {msg.role === "user" && (
                                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white dark:border-slate-600">
                                            <User size={16} className="text-slate-600 dark:text-slate-300" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <Bot size={16} className="text-white" />
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none px-5 py-3.5">
                                    <div className="flex gap-1.5">
                                        {[0,1,2].map(i => (
                                            <motion.div key={i} animate={{ y: [0,-4,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i*0.1 }} className="w-2 h-2 bg-blue-400 rounded-full" />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-900 h-fit">
                        <AnimatePresence>
                            {messages.length === 1 && !input && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pb-4 overflow-hidden">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Zap size={14} className="text-amber-500 fill-amber-500" />
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Quick Actions</p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {quickQuestions.map((q, i) => (
                                            <motion.button key={i} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }} onClick={() => setInput(q)}
                                                className="text-left text-xs p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 rounded-xl text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-blue-200 transition-all font-bold group"
                                            >
                                                <span className="group-hover:text-blue-600 transition-colors">{q}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative group">
                            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={handleKeyPress}
                                placeholder='Try: "Add Math quiz Friday" or "Delete OOP assignment"...'
                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-5 pr-14 py-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                                disabled={loading}
                            />
                            <button onClick={handleSend} disabled={loading || !input.trim()}
                                className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 active:scale-95 disabled:shadow-none"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest opacity-50">
                            Powered by GPT-3.5 
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}