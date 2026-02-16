// backend/routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

const tempAuth = (req, res, next) => {
  // Hardcoded user for testing
  req.user = { _id: '507f1f77bcf86cd799439011' }; // Dummy ID
  next();
};

// Get all tasks
router.get('/', tempAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id })
      .sort({ dueDate: 1, priority: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/', tempAuth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user._id
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update task
router.patch('/:id', tempAuth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', tempAuth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get task stats
router.get('/stats', tempAuth, async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ userId: req.user._id });
    const completedTasks = await Task.countDocuments({ 
      userId: req.user._id, 
      completed: true 
    });
    const pendingTasks = totalTasks - completedTasks;
    
    const overdueTasks = await Task.countDocuments({
      userId: req.user._id,
      completed: false,
      dueDate: { $lt: new Date() }
    });

    res.json({
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      overdue: overdueTasks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;