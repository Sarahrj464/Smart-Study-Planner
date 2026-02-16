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

// Enable CORS
app.use(cors());

// Health check route
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Root route
app.get('/', (req, res) => {
    res.send('<h1>🚀 StudyPulse API is running</h1><p>Visit the <a href="http://localhost:5173">Frontend Website</a> to use the application.</p>');
});

// ============================================
// ⭐ TASK ROUTES - NO AUTH (Testing Phase)
// ============================================
app.use('/api/v1/tasks', tasks);

// ============================================
// OTHER ROUTES (with their own auth)
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
        // Connect to database first
        await connectDB();

        server.listen(
            PORT,
            () => {
                console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT} with Socket.io`);
                console.log(`🔗 Backend API: http://localhost:${PORT}`);
                console.log(`🌐 Frontend Website: http://localhost:5173`);
                console.log(`✅ Tasks API: http://localhost:${PORT}/api/v1/tasks`);
            }
        );
    } catch (err) {
        console.error(`❌ Failed to start server: ${err.message}`);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});