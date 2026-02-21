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

        // Handle file upload (multipart)
        if (req.file) {
            req.body.image = `/uploads/${req.file.filename}`;
            req.body.photo = `/uploads/${req.file.filename}`;
        }

        // Handle base64 photo from VacationForm
        if (req.body.photo && req.body.photo.startsWith('data:image')) {
            // Store base64 directly — no file system needed
            // Already assigned, just keep it
        }

        // Vacation: dueDate can be startDate
        if (!req.body.dueDate && req.body.startDate) {
            req.body.dueDate = req.body.startDate;
        }

        // Vacation: time default
        if (!req.body.time) {
            req.body.time = '09:00 AM';
        }

        // Combine Date and Time into UTC
        if (req.body.dueDate) {
            const dateInput = new Date(req.body.dueDate);
            const combinedDate = new Date(Date.UTC(
                dateInput.getUTCFullYear(),
                dateInput.getUTCMonth(),
                dateInput.getUTCDate()
            ));
            const timeToUse = req.body.time;

            if (timeToUse && timeToUse.includes(':')) {
                const [timePart, modifier] = timeToUse.split(' ');
                let [hours, minutes] = timePart.split(':');
                let hoursNum = parseInt(hours, 10);
                if (modifier === 'PM' && hoursNum < 12) hoursNum += 12;
                if (modifier === 'AM' && hoursNum === 12) hoursNum = 0;
                combinedDate.setUTCHours(hoursNum, parseInt(minutes, 10), 0, 0);
            } else {
                combinedDate.setUTCHours(9, 0, 0, 0);
            }
            req.body.dueDate = combinedDate;
        }

        // Handle endDate for vacation
        if (req.body.endDate) {
            req.body.endDate = new Date(req.body.endDate);
        }

        // Handle startDate for class
        if (req.body.startDate) {
            req.body.startDate = new Date(req.body.startDate);
        }

        const task = await Task.create(req.body);

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (err) {
        console.error('Error creating task:', err);

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

        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this task' });
        }

        if (req.body.dueDate || req.body.time) {
            const dateInput = req.body.dueDate ? new Date(req.body.dueDate) : new Date(task.dueDate);
            const timeToUse = req.body.time || task.time;

            const y = dateInput.getUTCFullYear();
            const m = dateInput.getUTCMonth();
            const d = dateInput.getUTCDate();

            let hh = 9, mm = 0;
            if (timeToUse && timeToUse.includes(':')) {
                const [timePart, modifier] = timeToUse.split(' ');
                let [hours, minutes] = timePart.split(':');
                hh = parseInt(hours, 10);
                mm = parseInt(minutes, 10);
                if (modifier === 'PM' && hh < 12) hh += 12;
                if (modifier === 'AM' && hh === 12) hh = 0;
            }
            req.body.dueDate = new Date(Date.UTC(y, m, d, hh, mm, 0, 0));
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: task });
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

        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this task' });
        }

        await task.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};