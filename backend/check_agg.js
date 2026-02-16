const mongoose = require('mongoose');
const User = require('./src/models/User');
const Task = require('./src/models/Task');

const check = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/studyplanner');
        const user = await User.findOne({ name: /Sarah/i });
        const userObjectId = user._id;

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const categoricalAgg = await Task.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    $or: [
                        { updatedAt: { $gte: startOfMonth } },
                        { dueDate: { $gte: startOfMonth, $lt: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1) } }
                    ]
                }
            },
            {
                $group: {
                    _id: { type: "$type" },
                    total: { $sum: 1 },
                    completed: { $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] } }
                }
            }
        ]);

        console.log('AGG RESULT:', JSON.stringify(categoricalAgg, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
