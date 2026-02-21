const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const app = express();
const http = require('http');
const server = http.createServer(app);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Route files
const auth = require('./routes/auth');
const dashboard = require('./routes/dashboard');
const pomodoro = require('./routes/pomodoro');
const timetable = require('./routes/timetable');
const wellness = require('./routes/wellness');
const blog = require('./routes/blog');
const gamification = require('./routes/gamification');
const rooms = require('./routes/studyRoom');
const tasks = require('./routes/taskRoutes');
const goals = require('./routes/goal');
const aiChat = require('./routes/aiChat');
const notifications = require('./routes/notificationRoutes');
const syllabus = require('./routes/syllabusRoutes');

const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST']
    }
});

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev', {
        skip: (req, res) => req.url === '/health' || req.url === '/'
    }));
}

// Enable CORS with Credentials support
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// DEBUG: Log all requests
app.use((req, res, next) => {
    console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});

// Health check route
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Database health check
app.get('/db-health', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const state = mongoose.connection.readyState;
        const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
        res.json({ status: states[state], code: state });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
});


// Root route
app.get('/', (req, res) => {
    res.send('<h1>🚀 StudyPulse API is running</h1><p>Visit the <a href="http://localhost:5173">Frontend Website</a> to use the application.</p>');
});

// ============================================
// ⭐ TASK ROUTES
// ============================================
app.use('/api/v1/tasks', tasks);

// ============================================
// OTHER ROUTES
// ============================================
app.use('/api/v1/auth', auth);
app.use('/api/v1/dashboard', dashboard);
app.use('/api/v1/pomodoro', pomodoro);
app.use('/api/v1/timetable', timetable);
app.use('/api/v1/wellness', wellness);
app.use('/api/v1/blogs', blog);
app.use('/api/v1/gamification', gamification);
app.use('/api/v1/rooms', rooms);
app.use('/api/v1/goals', goals);
app.use('/api/v1/ai', aiChat);
app.use('/api/v1/notifications', notifications);
app.use('/api/v1/syllabus', syllabus);

// Socket.io integration
const studyRoomHandler = require('./sockets/studyRoomHandler');
io.on('connection', (socket) => {
    studyRoomHandler(io, socket);
});

// Mount errorHandler middleware LAST
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT} with Socket.io`);
            console.log(`🔗 Backend API: http://localhost:${PORT}`);
            console.log(`🌐 Frontend Website: http://localhost:5173`);
            console.log(`✅ Tasks API: http://localhost:${PORT}/api/v1/tasks`);
        });

        // ============================================
        // ✅ CRON JOBS - Automatic WhatsApp Notifications
        // ============================================
        const cron = require('node-cron');
        const User = require('./models/User');
        const Task = require('./models/Task');
        const { sendWhatsAppMessage } = require('./services/whatsappService');

        // ⏰ Every 30 minutes - Tasks due soon
        cron.schedule('*/30 * * * *', async () => {
            console.log('⏰ Cron: Checking tasks due in 30 minutes...');
            try {
                const now = new Date();
                const in30 = new Date(now.getTime() + 30 * 60 * 1000);

                const users = await User.find({
                    phoneNumber: { $ne: '' },
                    'notificationPrefs.reminders': true
                });

                for (const user of users) {
                    const dueTasks = await Task.find({
                        userId: user._id,
                        completed: false,
                        dueDate: { $gte: now, $lte: in30 },
                        reminderSent: { $ne: true }  // ✅ dobara reminder na jaye
                    });

                    for (const task of dueTasks) {
                        const message = `⏰ *Task Reminder - Smart Study Planner*\n\nYour task "${task.title}" is due in 30 minutes!\n\nOpen your planner: http://localhost:5173\n\nStay focused! 💪`;
                        await sendWhatsAppMessage(user.phoneNumber, message);
                        await Task.findByIdAndUpdate(task._id, { reminderSent: true }); // ✅ mark karo
                        console.log(`✅ Reminder sent to ${user.phoneNumber} for: ${task.title}`);
                    }
                }
            } catch (err) {
                console.error('❌ Reminder cron error:', err.message);
            }
        });

        // 📊 Every day at 9:00 AM - Daily Summary
        cron.schedule('0 9 * * *', async () => {
            console.log('📊 Cron: Sending daily summaries...');
            try {
                const users = await User.find({
                    phoneNumber: { $ne: '' },
                    'notificationPrefs.dailySummary': true
                });

                for (const user of users) {
                    const allTasks = await Task.find({ userId: user._id });
                    const completed = allTasks.filter(t => t.completed).length;
                    const pending = allTasks.filter(t => !t.completed).length;
                    const topTask = allTasks.find(t => !t.completed && t.priority === 'High');
                    const anyPending = allTasks.find(t => !t.completed);

                    const message = `📚 *Good Morning, ${user.name}!*\n\nHere is your daily study summary:\n✅ Completed: ${completed} tasks\n⏳ Pending: ${pending} tasks\n\n🎯 Top Priority: ${topTask ? topTask.title : anyPending ? anyPending.title : 'No pending tasks'}\n\nHave a productive day! 💪\n\n_Smart Study Planner_`;

                    await sendWhatsAppMessage(user.phoneNumber, message);
                    console.log(`✅ Daily summary sent to ${user.phoneNumber}`);
                }
            } catch (err) {
                console.error('❌ Daily summary cron error:', err.message);
            }
        });

        // ⚠️ Every hour - Overdue tasks alert
        cron.schedule('0 * * * *', async () => {
            console.log('⚠️ Cron: Checking overdue tasks...');
            try {
                const now = new Date();
                const users = await User.find({
                    phoneNumber: { $ne: '' },
                    'notificationPrefs.overdueAlerts': true
                });

                for (const user of users) {
                    const overdueTasks = await Task.find({
                        userId: user._id,
                        completed: false,
                        dueDate: { $lt: now },
                        overdueAlertSent: { $ne: true }  // ✅ sirf ek baar alert
                    });

                    for (const task of overdueTasks) {
                        const dueTime = new Date(task.dueDate).toLocaleString('en-PK');
                        const message = `⚠️ *Overdue Task Alert - Smart Study Planner*\n\nYour task "${task.title}" is overdue!\nIt was due at: ${dueTime}\n\nPlease complete it now: http://localhost:5173\n\n_Smart Study Planner_`;

                        await sendWhatsAppMessage(user.phoneNumber, message);
                        await Task.findByIdAndUpdate(task._id, { overdueAlertSent: true }); // ✅ mark karo
                        console.log(`✅ Overdue alert sent to ${user.phoneNumber} for: ${task.title}`);
                    }
                }
            } catch (err) {
                console.error('❌ Overdue cron error:', err.message);
            }
        });

        console.log('✅ WhatsApp Cron Jobs Started!');
        console.log('   ⏰ Task Reminders  : Every 30 minutes');
        console.log('   📊 Daily Summary   : Every day at 9:00 AM');
        console.log('   ⚠️  Overdue Alerts  : Every hour');

    } catch (err) {
        console.error(`❌ Failed to start server: ${err.message}`);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});