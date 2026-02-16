const MoodLog = require('../models/MoodLog');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all mood logs for a user
// @route   GET /api/v1/wellness
// @access  Private
exports.getMoodLogs = async (req, res, next) => {
    try {
        const logs = await MoodLog.find({ userId: req.user.id }).sort('-date');
        res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new mood log
// @route   POST /api/v1/wellness
// @access  Private
exports.createMoodLog = async (req, res, next) => {
    try {
        req.body.userId = req.user.id;

        const log = await MoodLog.create(req.body);

        res.status(201).json({ success: true, data: log });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete mood log
// @route   DELETE /api/v1/wellness/:id
// @access  Private
exports.deleteMoodLog = async (req, res, next) => {
    try {
        const log = await MoodLog.findById(req.params.id);

        if (!log) {
            return next(new ErrorResponse('Mood log not found', 404));
        }

        if (log.userId.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized to delete this log', 401));
        }

        await log.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
