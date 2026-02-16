const StudyRoom = require('../models/StudyRoom');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all study rooms
// @route   GET /api/v1/rooms
// @access  Private
exports.getRooms = async (req, res, next) => {
    try {
        const rooms = await StudyRoom.find().populate('host', 'name profilePicture');
        res.status(200).json({ success: true, count: rooms.length, data: rooms });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single room
// @route   GET /api/v1/rooms/:id
// @access  Private
exports.getRoom = async (req, res, next) => {
    try {
        const room = await StudyRoom.findById(req.params.id).populate('host members', 'name profilePicture');

        if (!room) {
            return next(new ErrorResponse('Room not found', 404));
        }

        res.status(200).json({ success: true, data: room });
    } catch (err) {
        next(err);
    }
};

// @desc    Create study room
// @route   POST /api/v1/rooms
// @access  Private
exports.createRoom = async (req, res, next) => {
    try {
        req.body.host = req.user.id;

        const room = await StudyRoom.create(req.body);

        res.status(201).json({ success: true, data: room });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete study room
// @route   DELETE /api/v1/rooms/:id
// @access  Private
exports.deleteRoom = async (req, res, next) => {
    try {
        const room = await StudyRoom.findById(req.params.id);

        if (!room) {
            return next(new ErrorResponse('Room not found', 404));
        }

        if (room.host.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to delete this room', 401));
        }

        await room.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
