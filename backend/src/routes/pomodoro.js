const express = require('express');
const { getSessions, createSession } = require('../controllers/pomodoroController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getSessions)
    .post(createSession);

module.exports = router;
