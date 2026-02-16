const mongoose = require('mongoose');
const User = require('./src/models/User');
const Task = require('./src/models/Task');
const PomodoroSession = require('./src/models/PomodoroSession');
const request = require('supertest');
const app = require('./src/server'); // Assuming server exports app, need to check
const dotenv = require('dotenv');
const { generateToken } = require('./src/utils/jwt');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/study_planner_db';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

async function run() {
    try {
        const testEmail = `stats_test_${Date.now()}@gmail.com`;
        const testUser = await User.create({
            name: 'Stats Tester',
            email: testEmail,
            password: 'password123',
            role: 'student'
        });

        const token = generateToken(testUser._id);
        const agent = request('http://127.0.0.1:5000'); // Test against running server

        console.log(`User created: ${testEmail}`);

        // 1. Create Data for Streak (Last 3 days) and Weekly Progress
        const days = [0, 1, 2];
        for (const d of days) {
            const date = new Date();
            date.setDate(date.getDate() - d);

            // Create a completed task
            await Task.create({
                userId: testUser._id,
                title: `Task Day ${d}`,
                subject: 'Math',
                type: 'Task',
                dueDate: date,
                time: '10:00 AM',
                completed: true,
                updatedAt: date // Important for aggregation
            });

            // Create a completed session
            await PomodoroSession.create({
                userId: testUser._id,
                duration: 60,
                type: 'Study',
                date: date,
                completed: true
            });
        }

        // 2. Create a Class Task (For Class Progress)
        await Task.create({
            userId: testUser._id,
            title: 'Math Class',
            subject: 'Math',
            type: 'Class',
            dueDate: new Date(),
            time: '10:00 AM',
            completed: true,
            updatedAt: new Date()
        });

        // Create an incomplete Class Task (to show percentage)
        await Task.create({
            userId: testUser._id,
            title: 'Physics Class',
            subject: 'Physics',
            type: 'Class',
            dueDate: new Date(),
            time: '10:00 AM',
            completed: false
        });


        console.log('Seeded data for last 3 days + Class tasks.');

        // 3. Fetch Dashboard
        const res = await agent
            .get('/api/v1/dashboard')
            .set('Cookie', `token=${token}`);

        if (res.status !== 200) {
            console.error('Failed to get dashboard:', res.body);
            return;
        }

        const data = res.body.data;
        const stats = data.user.studyStats; // Streak is here? Or calculated on fly?
        // Wait, studyStats.streak is in User model, updated by something?
        // Dashboard controller calculates streak on the fly usually or updates user model.
        // Let's check dashboard response structure for streak.

        console.log('--- Verification Results ---');
        console.log('Weekly Progress Length:', data.analytics.weeklyProgress.length);
        console.log('Weekly Progress Data:', JSON.stringify(data.analytics.weeklyProgress, null, 2));

        // Check Streak
        // Note: If dashboard logic calculates streak dynamically, it should be in data.user.studyStats.streak or data.analytics.streak
        // Looking at dashboardController, check where streak comes from.
        console.log('User Study Stats:', data.user.studyStats);

        // Check Class Progress
        console.log('Categorical Progress:', JSON.stringify(data.analytics.categoricalProgress, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
