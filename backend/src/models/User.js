const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ type: String }],
  studyStats: { type: Object, default: {} },
  profilePicture: { type: String, default: '' },

  // ✅ WhatsApp Notification Fields
  phoneNumber: {
    type: String,
    default: ''
  },
  notificationPrefs: {
    reminders: { type: Boolean, default: true },
    dailySummary: { type: Boolean, default: true },
    overdueAlerts: { type: Boolean, default: true }
  }

}, { timestamps: true });

// ✅ Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ matchPassword method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);