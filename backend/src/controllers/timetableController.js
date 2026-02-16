const Timetable = require('../models/Timetable');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user timetable
// @route   GET /api/v1/timetable
// @access  Private
exports.getTimetable = async (req, res, next) => {
    try {
        let timetable = await Timetable.findOne({ userId: req.user.id });

        if (!timetable) {
            timetable = await Timetable.create({ userId: req.user.id, schedule: [] });
        }

        res.status(200).json({ success: true, data: timetable });
    } catch (err) {
        next(err);
    }
};

// @desc    Add/Update schedule item
// @route   POST /api/v1/timetable/item
// @access  Private
exports.updateSchedule = async (req, res, next) => {
    try {
        const { schedule } = req.body; // Full schedule array or logic to push

        const timetable = await Timetable.findOneAndUpdate(
            { userId: req.user.id },
            { schedule },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, data: timetable });
    } catch (err) {
        next(err);
    }
};

// @desc    Clear timetable
// @route   DELETE /api/v1/timetable
// @access  Private
exports.clearTimetable = async (req, res, next) => {
    try {
        await Timetable.findOneAndUpdate(
            { userId: req.user.id },
            { schedule: [] }
        );
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
