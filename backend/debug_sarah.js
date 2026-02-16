const mongoose = require('mongoose');
const User = require('./src/models/User');

const MONGO_URI = 'mongodb://admin:admin123@mongodb:27017/studyplanner?authSource=admin';

const debug = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const email = 'sarah.dev2k25@gmail.com';
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('User not found.');
            process.exit(1);
        }

        const testPasswords = ['password123', 'Password123', 'sarah123'];

        for (const pass of testPasswords) {
            const isMatch = await user.matchPassword(pass);
            console.log(`Checking "${pass}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debug();
