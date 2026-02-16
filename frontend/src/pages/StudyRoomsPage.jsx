import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Users, Send, MessageSquare, LogOut, Plus, Shield, ShieldCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const MOCK_ROOMS = [
    {
        _id: '1',
        roomName: 'Physics Study Group',
        host: { name: 'Alice' },
        isPrivate: false,
        activeUsers: 5,
        topic: 'Quantum Mechanics'
    },
    {
        _id: '2',
        roomName: 'Late Night Coding',
        host: { name: 'Bob' },
        isPrivate: true,
        activeUsers: 3,
        topic: 'React & Node.js'
    },
    {
        _id: '3',
        roomName: 'Calculus Review',
        host: { name: 'Charlie' },
        isPrivate: false,
        activeUsers: 8,
        topic: 'Derivatives'
    }
];

const MOCK_MESSAGES = [
    { id: 1, text: "Hey everyone! How's the study session going?", sender: "Alice", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 2, text: "Pretty good, just reviewing some notes.", sender: "Bob", timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
    { id: 3, text: "Does anyone have the formula for...", sender: "Charlie", timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
];

const StudyRoomsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [rooms, setRooms] = useState(MOCK_ROOMS);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // New Room Form State
    const [newRoomName, setNewRoomName] = useState('');
    const [newRoomTopic, setNewRoomTopic] = useState('');

    const scrollRef = useRef(null);

    // Initial Load
    useEffect(() => {
        // In a real app, fetch rooms here
        setRooms(MOCK_ROOMS);
    }, []);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (activeRoom) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, activeRoom]);

    const joinRoom = (room) => {
        setActiveRoom(room);
        setMessages(MOCK_MESSAGES); // Load mock history
        toast.success(`Joined ${room.roomName}`);
    };

    const leaveRoom = () => {
        setActiveRoom(null);
        setMessages([]);
        toast('Left room', { icon: '👋' });
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const newMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: user?.name || 'You',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');

        // Simulate incoming response
        setTimeout(() => {
            const responses = [
                "That's interesting!",
                "I agree.",
                "Can you explain that more?",
                "Focusing...",
                "Taking a break soon."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const botMessage = {
                id: Date.now() + 1,
                text: randomResponse,
                sender: "StudyBot",
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, botMessage]);
        }, 3000);
    };

    const createRoom = (e) => {
        e.preventDefault();
        if (!newRoomName || !newRoomTopic) return;

        const newRoom = {
            _id: Date.now().toString(),
            roomName: newRoomName,
            topic: newRoomTopic,
            host: { name: user?.name || 'You' },
            isPrivate: false,
            activeUsers: 1
        };

        setRooms(prev => [newRoom, ...prev]);
        setShowCreateModal(false);
        setNewRoomName('');
        setNewRoomTopic('');
        toast.success('Room created successfully!');
        joinRoom(newRoom);
    };

    // Modal Component
    const CreateRoomModal = () => (
        <AnimatePresence>
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCreateModal(false)}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800"
                    >
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Create Study Room</h3>
                        <form onSubmit={createRoom} className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Room Name</label>
                                <input
                                    type="text"
                                    value={newRoomName}
                                    onChange={(e) => setNewRoomName(e.target.value)}
                                    placeholder="e.g. Biology Exam Prep"
                                    className="w-full px-4 py-2 mt-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Topic</label>
                                <input
                                    type="text"
                                    value={newRoomTopic}
                                    onChange={(e) => setNewRoomTopic(e.target.value)}
                                    placeholder="e.g. Genetics"
                                    className="w-full px-4 py-2 mt-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                                Create Room
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in duration-500 relative">
            <CreateRoomModal />

            {/* Sidebar: Room List */}
            <div className={`w-full md:w-80 flex-col gap-4 ${activeRoom ? 'hidden md:flex' : 'flex'}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                            <Users size={20} className="text-blue-500" />
                            Study Rooms
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Join a room to collaborate</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 [&::-webkit-scrollbar]:hidden">
                    {rooms.map((room) => (
                        <button
                            key={room._id}
                            onClick={() => joinRoom(room)}
                            className={`w-full text-left p-4 rounded-2xl transition-all shadow-sm group border-2 ${activeRoom?._id === room._id
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                                    : 'bg-white dark:bg-slate-900 border-transparent hover:border-blue-200 dark:hover:border-slate-700'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`font-bold ${activeRoom?._id === room._id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                    {room.roomName}
                                </span>
                                {room.isPrivate && <Shield size={14} className="text-slate-400" />}
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                    <User size={12} /> {room.activeUsers} online
                                </span>
                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md font-medium">
                                    {room.topic}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main: Chat View */}
            {activeRoom ? (
                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col relative">
                    <header className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                                {activeRoom.roomName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{activeRoom.roomName}</h3>
                                <p className="text-xs text-emerald-500 flex items-center gap-1 font-bold">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    LIVE
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={leaveRoom}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                            title="Leave Room"
                        >
                            <LogOut size={20} />
                        </button>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/30">
                        {messages.map((msg, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id}
                                className={`flex flex-col ${msg.sender === (user?.name || 'You') ? 'items-end' : 'items-start'}`}
                            >
                                <div className="flex items-center gap-2 mb-1 px-1">
                                    <span className="text-[10px] font-bold text-slate-400">{msg.sender}</span>
                                    <span className="text-[10px] text-slate-300">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm shadow-sm ${msg.sender === (user?.name || 'You')
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                                    }`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                        <div ref={scrollRef} />
                    </div>

                    <form onSubmit={sendMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 bg-white dark:bg-slate-900">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder={`Message #${activeRoom.roomName}...`}
                            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!inputMessage.trim()}
                            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
                        <MessageSquare size={48} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400">Select a room to join the discussion</h3>
                    <p className="text-sm text-slate-400 mt-1 max-w-xs text-center">Join an existing room or create a new one to start collaborating with peers.</p>
                </div>
            )}
        </div>
    );
};

export default StudyRoomsPage;
