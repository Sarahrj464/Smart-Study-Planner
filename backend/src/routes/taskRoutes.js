// backend/src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Simple auth middleware (temporary)
const tempAuth = (req, res, next) => {
  // Create a dummy user ID for testing
  req.user = { _id: '507f1f77bcf86cd799439011' };
  next();
};

// Get all tasks
router.get('/', tempAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id })
      .sort({ dueDate: 1, priority: -1 });
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
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
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
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
      return res.status(404).json({ 
        success: false,
        error: 'Task not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
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
      return res.status(404).json({ 
        success: false,
        error: 'Task not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Toggle complete
router.patch('/:id/complete', tempAuth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        error: 'Task not found' 
      });
    }
    
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;
    await task.save();
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Toggle complete error:', error);
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;