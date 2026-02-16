const mongoose = require('mongoose');

const studyRoomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: [true, 'Please add a room name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    host: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    members: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StudyRoom', studyRoomSchema);
