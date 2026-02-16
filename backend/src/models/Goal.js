const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a goal title'],
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['monthly'],
        default: 'monthly'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Goal', GoalSchema);
