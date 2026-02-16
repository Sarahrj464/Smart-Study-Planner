import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from '../config/db.js';

// Load environment variables from parent directory
// Load environment variables
dotenv.config();
// Fallback for different directory structures
dotenv.config({ path: '../.env' });
dotenv.config({ path: 'auth/.env' });


// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Test route
app.get('/', (req, res) => {
    res.json({
        message: '✅ Smart Study Planner API is running',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

// Import routes
import authRoutes from '../routes/auth.js';

// Use routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

console.log('🔧 Starting server...');
console.log('📍 MONGO_URI:', process.env.MONGO_URI ? 'Set ✅' : 'Not Set ❌');

connectDB()
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
            console.log(`🔗 API URL: http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        process.exit(1);
    });