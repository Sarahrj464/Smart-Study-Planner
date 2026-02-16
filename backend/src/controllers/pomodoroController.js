const PomodoroSession = require('../models/PomodoroSession');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all sessions for a user
// @route   GET /api/v1/pomodoro
// @access  Private
exports.getSessions = async (req, res, next) => {
    try {
        const sessions = await PomodoroSession.find({ userId: req.user.id });
        res.status(200).json({ success: true, count: sessions.length, data: sessions });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new pomodoro session
// @route   POST /api/v1/pomodoro
// @access  Private
exports.createSession = async (req, res, next) => {
    try {
        req.body.userId = req.user.id;

        const session = await PomodoroSession.create(req.body);

        // Update user XP and total hours if completed
        if (req.body.completed) {
            const xpEarned = 10; // Base XP
            await User.findByIdAndUpdate(req.user.id, {
                $inc: {
                    'xp': xpEarned,
                    'studyStats.totalHours': (req.body.duration / 60)
                }
            });
        }

        res.status(201).json({ success: true, data: session });
    } catch (err) {
        next(err);
    }
};
