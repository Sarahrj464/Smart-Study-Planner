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
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    details: {
        type: String,
        trim: true,
        maxlength: [1000, 'Details cannot be more than 1000 characters']
    },
    subject: {
        type: String,
        required: [true, 'Please select a subject'],
        enum: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Geography', 'English', 'Other'],
        default: 'Other'
    },
    // Course under subject (e.g. DSA under Computer Science)
    course: {
        type: String,
        trim: true,
        default: ''
    },
    type: {
        type: String,
        enum: ['task', 'Task', 'class', 'Class', 'exam', 'Exam', 'Quiz', 'Test', 'vacation', 'Vacation', 'Xtra', 'xtra'],
        default: 'Task'
    },
    examType: {
        type: String,
        enum: ['Exam', 'Quiz', 'Test'],
        default: 'Exam'
    },
    occurs: {
        type: String,
        enum: ['once', 'Once', 'repeating', 'Repeating'],
        default: 'Once'
    },
    repeatDays: {
        type: [String],
        default: []
    },
    dueDate: {
        type: Date,
        required: [true, 'Please add a due date']
    },
    time: {
        type: String,
        default: '09:00 AM'
    },
    startTime: { type: String },
    endTime: { type: String },
    teacher: { type: String, trim: true },
    room: { type: String, trim: true },
    building: { type: String, trim: true },
    seat: { type: String, trim: true },
    duration: { type: Number },
    estimatedMinutes: { type: Number, default: 30 },
    mode: {
        type: String,
        enum: ['in-person', 'In Person', 'online', 'Online'],
        default: 'In Person'
    },
    meetingLink: {
        type: String,
        trim: true,
        default: ''
    },
    photo: { type: String },
    image: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['high', 'High', 'medium', 'Medium', 'low', 'Low'],
        default: 'Medium'
    },
    tags: [{ type: String }],
    overdueAlertSent: {
        type: Boolean,
        default: false
    },
    reminderSent: {
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