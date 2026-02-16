const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const UserSchema = new mongoose.Schema({
    email: String,
    role: String
});

const User = mongoose.model('User', UserSchema);

const analyzeUsers = async () => {
    try {
        const localUri = process.env.MONGO_URI.replace('mongodb:27017', 'localhost:27017');
        await mongoose.connect(localUri);
        console.log('MongoDB Connected to:', localUri);

        const totalUsers = await User.countDocuments();
        const admins = await User.find({ role: 'admin' }).select('email');
        const students = await User.find({ role: 'student' }).select('email');

        console.log('--- USER DATA ---');
        console.log(`Total Users: ${totalUsers}`);
        console.log(`Admins (${admins.length}):`, admins.map(a => a.email));
        console.log(`Students (${students.length}):`, students.map(s => s.email));
        console.log('------------------');

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

analyzeUsers();
