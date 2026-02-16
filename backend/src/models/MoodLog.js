const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    mood: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    note: {
        type: String,
        maxlength: 500
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MoodLog', moodLogSchema);
