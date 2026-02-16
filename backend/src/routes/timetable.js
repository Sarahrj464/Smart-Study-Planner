const express = require('express');
const { getTimetable, updateSchedule, clearTimetable } = require('../controllers/timetableController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getTimetable)
    .delete(clearTimetable);

router.post('/schedule', updateSchedule);

module.exports = router;
