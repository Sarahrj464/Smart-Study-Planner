const mongoose = require('mongoose');

const pomodoroSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    duration: {
        type: Number,
        required: [true, 'Please add session duration in minutes']
    },
    completed: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PomodoroSession', pomodoroSessionSchema);
