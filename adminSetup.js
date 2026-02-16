const mongoose = require('mongoose');
const User = require('./backend/src/models/User');
const dotenv = require('dotenv');
const readline = require('readline');

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Admin Setup...');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

const showStats = async () => {
    const students = await User.countDocuments({ role: 'student' });
    const admins = await User.countDocuments({ role: 'admin' });
    console.log(`\n--- StudyPulse User Stats ---`);
    console.log(`Students: ${students}`);
    console.log(`Admins:   ${admins}`);
    console.log(`-----------------------------\n`);
};

const promoteToAdmin = async (email) => {
    const user = await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { role: 'admin' },
        { new: true }
    );
    if (user) {
        console.log(`\nSUCCESS: ${user.name} (${user.email}) has been promoted to ADMIN.`);
    } else {
        console.log(`\nERROR: User with email ${email} not found.`);
    }
};

const clearUsers = async () => {
    const result = await User.deleteMany({});
    console.log(`\nSUCCESS: Deleted ${result.deletedCount} users from the database.`);
};

const main = async () => {
    await connectDB();
    await showStats();

    console.log('1. Promote User to Admin');
    console.log('2. Clear All Users (WARNING: IRREVERSIBLE)');
    console.log('3. Exit');

    rl.question('\nSelect an option: ', async (choice) => {
        if (choice === '1') {
            rl.question('Enter user email to promote: ', async (email) => {
                await promoteToAdmin(email);
                await showStats();
                process.exit(0);
            });
        } else if (choice === '2') {
            rl.question('Are you absolutely sure? (yes/no): ', async (confirm) => {
                if (confirm.toLowerCase() === 'yes') {
                    await clearUsers();
                    await showStats();
                } else {
                    console.log('Action cancelled.');
                }
                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    });
};

main();
