// backend/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Basic Info
  type: {
    type: String,
    enum: ['task', 'class', 'exam', 'vacation'],
    default: 'task'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  details: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true
  },
  
  // ⭐ NEW - Priority & Time
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  estimatedMinutes: {
    type: Number,
    default: 30
  },
  actualMinutes: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Scheduling
  dueDate: {
    type: Date,
    required: true
  },
  dueTime: String,
  
  occurs: {
    type: String,
    enum: ['once', 'repeating'],
    default: 'once'
  },
  repeatPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekdays', 'weekly', 'monthly']
    },
    endDate: Date
  },
  
  // Status
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  
  // Exam specific
  examType: {
    type: String,
    enum: ['exam', 'quiz', 'test']
  },
  examMode: {
    type: String,
    enum: ['in-person', 'online']
  },
  seat: String,
  room: String,
  duration: Number,
  
  // Class specific
  className: String,
  teacher: String,
  mode: {
    type: String,
    enum: ['in-person', 'online']
  },
  building: String,
  
  // Reminders
  reminders: [{
    type: String,
    sent: Boolean
  }]
}, {
  timestamps: true
});

// Indexes for faster queries
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ userId: 1, priority: 1 });

module.exports = mongoose.model('Task', taskSchema);