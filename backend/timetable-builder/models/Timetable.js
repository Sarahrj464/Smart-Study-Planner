const mongoose = require('mongoose');

const TimetableItemSchema = new mongoose.Schema({
  id: { type: String, required: true }, // client-generated id (uuid or simple string)
  title: { type: String, required: true },
  start: { type: String, required: true }, // e.g. "09:00"
  end: { type: String, required: true },   // e.g. "10:15"
  location: { type: String, default: '' },
  color: { type: String, default: '#60a5fa' },
  createdAt: { type: Date, default: Date.now }
});

const TimetableColumnSchema = new mongoose.Schema({
  day: { type: String, required: true }, // "Mon", "Tue", ...
  items: [TimetableItemSchema]
});

const TimetableSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  columns: [TimetableColumnSchema], // array of 7 day columns (order preserved)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TimetableSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Timetable', TimetableSchema);