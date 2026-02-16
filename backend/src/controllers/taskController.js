const Task = require('../models/Task');

// @desc    Get all tasks for user
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: 'User authentication failed' });
        }

        const tasks = await Task.find({ userId: req.user.id }).sort({ dueDate: 1, time: 1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        next(err);
    }
};

exports.createTask = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: 'User authentication failed' });
        }

        req.body.userId = req.user.id;

        // Handle Image Upload
        if (req.file) {
            req.body.image = `/uploads/${req.file.filename}`;
            req.body.photo = `/uploads/${req.file.filename}`; // Backward compatibility if needed
        }

        // Validation for required fields to fail fast
        const { title, subject, dueDate, time } = req.body;
        if (!title || !subject || !dueDate || !time) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields: title, subject, dueDate, time'
            });
        }

        const task = await Task.create(req.body);

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (err) {
        console.error('Error creating task:', err);

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }

        next(err);
    }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Make sure user owns task
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this task' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Make sure user owns task
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this task' });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
