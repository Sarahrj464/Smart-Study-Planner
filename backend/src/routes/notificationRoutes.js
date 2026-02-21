const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    sendTestMessage,
    sendTaskReminder,
    sendDailySummary,
    sendOverdueAlert,
    updateNotificationSettings,
    getNotificationSettings
} = require('../controllers/notificationController');

router.get('/settings', protect, getNotificationSettings);
router.put('/settings', protect, updateNotificationSettings);
router.post('/test', protect, sendTestMessage);
router.post('/task-reminder', protect, sendTaskReminder);
router.post('/daily-summary', protect, sendDailySummary);
router.post('/overdue-alert', protect, sendOverdueAlert);

module.exports = router;