const StudyRoom = require('../models/StudyRoom');

module.exports = (io, socket) => {
    // Join Room
    socket.on('join-room', async ({ roomId, user }) => {
        try {
            const room = await StudyRoom.findById(roomId);

            if (!room) {
                return socket.emit('error', { message: 'Room not found' });
            }

            // Limit 10 users per room
            const currentMembers = io.sockets.adapter.rooms.get(roomId);
            if (currentMembers && currentMembers.size >= 10) {
                return socket.emit('error', { message: 'Room is full (Max 10 users)' });
            }

            socket.join(roomId);

            // Notify others
            socket.to(roomId).emit('notification', {
                message: `${user.name} has joined the room`,
                type: 'join'
            });

            console.log(`User ${user.name} joined room ${roomId}`);
        } catch (err) {
            socket.emit('error', { message: 'Failed to join room' });
        }
    });

    // Chat Message
    socket.on('send-message', ({ roomId, message, user }) => {
        io.to(roomId).emit('message', {
            text: message,
            sender: user.name,
            timestamp: new Date()
        });
    });

    // Typing Indicator
    socket.on('typing', ({ roomId, user, isTyping }) => {
        socket.to(roomId).emit('display-typing', {
            user: user.name,
            isTyping
        });
    });

    // Leave Room
    socket.on('leave-room', ({ roomId, user }) => {
        socket.leave(roomId);
        socket.to(roomId).emit('notification', {
            message: `${user.name} has left the room`,
            type: 'leave'
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected from socket');
    });
};
