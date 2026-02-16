const Goal = require('../models/Goal');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all monthly goals
// @route   GET /api/v1/goals
// @access  Private
exports.getGoals = async (req, res, next) => {
    try {
        const goals = await Goal.find({ userId: req.user.id, type: 'monthly' }).sort('-createdAt');
        res.status(200).json({ success: true, data: goals });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a goal
// @route   POST /api/v1/goals
// @access  Private
exports.createGoal = async (req, res, next) => {
    try {
        req.body.userId = req.user.id;
        const goal = await Goal.create(req.body);
        res.status(201).json({ success: true, data: goal });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a goal
// @route   PUT /api/v1/goals/:id
// @access  Private
exports.updateGoal = async (req, res, next) => {
    try {
        let goal = await Goal.findById(req.params.id);
        if (!goal) return next(new ErrorResponse('Goal not found', 404));
        if (goal.userId.toString() !== req.user.id) return next(new ErrorResponse('Not authorized', 401));

        goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: goal });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a goal
// @route   DELETE /api/v1/goals/:id
// @access  Private
exports.deleteGoal = async (req, res, next) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return next(new ErrorResponse('Goal not found', 404));
        if (goal.userId.toString() !== req.user.id) return next(new ErrorResponse('Not authorized', 401));

        await goal.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
