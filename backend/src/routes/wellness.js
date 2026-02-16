const express = require('express');
const { getMoodLogs, createMoodLog, deleteMoodLog } = require('../controllers/wellnessController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getMoodLogs)
    .post(createMoodLog);

router.route('/:id')
    .delete(deleteMoodLog);

module.exports = router;
