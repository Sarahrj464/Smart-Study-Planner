const express = require('express');
const { getRooms, getRoom, createRoom, deleteRoom } = require('../controllers/studyRoomController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getRooms)
    .post(createRoom);

router.route('/:id')
    .get(getRoom)
    .delete(deleteRoom);

module.exports = router;
