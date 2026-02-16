const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    details: {
        type: String,
        trim: true,
        maxlength: [500, 'Details cannot be more than 500 characters']
    },
    subject: {
        type: String,
        required: [true, 'Please select a subject'],
        enum: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Geography', 'English', 'Other'],
        default: 'Other'
    },
    type: {
        type: String,
        enum: ['Task', 'Class', 'Exam', 'Vacation', 'Xtra'],
        default: 'Task'
    },
    occurs: {
        type: String,
        enum: ['Once', 'Repeating'],
        default: 'Once'
    },
    dueDate: {
        type: Date,
        required: [true, 'Please add a due date']
    },
    time: {
        type: String, // Storing as string "HH:MM AM/PM" or "HH:MM"
        required: [true, 'Please add a time']
    },
    // New Fields for Advanced Features
    teacher: { type: String, trim: true },
    room: { type: String, trim: true },
    building: { type: String, trim: true },
    seat: { type: String, trim: true },
    duration: { type: Number }, // in minutes
    mode: {
        type: String,
        enum: ['In Person', 'Online'],
        default: 'In Person'
    },
    photo: { type: String }, // URL or base64 placeholder
    startDate: { type: Date },
    image: {
        type: String // URL to uploaded image
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
