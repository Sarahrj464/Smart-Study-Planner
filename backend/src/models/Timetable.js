const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    schedule: [
        {
            day: {
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                required: true
            },
            timeSlot: {
                type: String,
                required: true // e.g., "09:00 - 10:00"
            },
            subject: {
                type: String,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Timetable', timetableSchema);
