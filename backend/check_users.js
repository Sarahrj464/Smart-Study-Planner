const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');
dotenv.config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const emails = ['sarahmurtaza2005@gmail.com', 'sarahfashion@gmail.com', 'sarah.dev2k25@gmail.com'];

        for (const email of emails) {
            const users = await User.find({ email: email.toLowerCase().trim() }).select('+password');
            console.log(`\nResults for ${email}:`);
            console.log(`Count: ${users.length}`);
            users.forEach((u, i) => {
                console.log(`User ${i + 1}:`, {
                    id: u._id,
                    name: u.name,
                    role: u.role,
                    hasPassword: !!u.password,
                    passwordLength: u.password ? u.password.length : 0
                });
            });
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Script failed:', err);
    }
}
checkUsers();
