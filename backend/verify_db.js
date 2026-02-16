const mongoose = require('mongoose');
const User = require('./src/models/User');
const Task = require('./src/models/Task');
const PomodoroSession = require('./src/models/PomodoroSession');

const verify = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/studyplanner');
        console.log('Connected to DB');

        const user = await User.findOne({ name: /Sarah/i });
        if (!user) {
            console.log('Sarah not found');
            process.exit(0);
        }
        console.log('User ID:', user._id);
        console.log('User Stats in Model:', JSON.stringify(user.studyStats, null, 2));

        const tasks = await Task.find({ userId: user._id });
        console.log('Total Tasks in DB:', tasks.length);
        console.log('Task Breakdown (Top 5):', tasks.slice(0, 5).map(t => ({ title: t.title, type: t.type, status: t.completed, due: t.dueDate })));

        const sessions = await PomodoroSession.find({ userId: user._id });
        console.log('Total Sessions in DB:', sessions.length);
        console.log('Last Session:', sessions.length > 0 ? sessions[sessions.length - 1] : 'None');

        // Check types in DB - maybe they are lowercase?
        const types = await Task.distinct('type', { userId: user._id });
        console.log('Types found in DB for Sarah:', types);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verify();
