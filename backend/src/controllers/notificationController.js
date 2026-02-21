const User = require('../models/User');
const { sendWhatsAppMessage } = require('../services/whatsappService');

exports.sendTestMessage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.phoneNumber) {
            return res.status(400).json({ success: false, message: 'Phone number not set. Please update your profile first.' });
        }
        const message = `✅ *Smart Study Planner*\n\nWhatsApp connected successfully!\nHello ${user.name}! 🎉\nYou will now receive all your study notifications here. 📚`;
        const result = await sendWhatsAppMessage(user.phoneNumber, message);
        if (result.success) {
            res.status(200).json({ success: true, message: 'Test message sent! Check your WhatsApp.' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to send message', error: result.error });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.sendTaskReminder = async (req, res) => {
    try {
        const { taskName, dueTime } = req.body;
        const user = await User.findById(req.user.id);
        if (!user.phoneNumber) return res.status(400).json({ success: false, message: 'Phone number not set.' });
        if (!user.notificationPrefs?.reminders) return res.status(200).json({ success: true, message: 'Reminders are disabled.' });

        const message = `⏰ *Task Reminder - Smart Study Planner*\n\nYour task "${taskName}" is due in 30 minutes!\n\nOpen your planner: http://localhost:5173\n\nStay focused! 💪`;
        const result = await sendWhatsAppMessage(user.phoneNumber, message);
        res.status(200).json({ success: result.success, message: result.success ? 'Reminder sent!' : result.error });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.sendDailySummary = async (req, res) => {
    try {
        const { pending, completed, topTask } = req.body;
        const user = await User.findById(req.user.id);
        if (!user.phoneNumber) return res.status(400).json({ success: false, message: 'Phone number not set.' });
        if (!user.notificationPrefs?.dailySummary) return res.status(200).json({ success: true, message: 'Daily summary disabled.' });

        const message = `📚 *Good Morning, ${user.name}!*\n\nHere is your daily study summary:\n✅ Completed: ${completed || 0} tasks\n⏳ Pending: ${pending || 0} tasks\n\n🎯 Top Priority: ${topTask || 'No tasks for today'}\n\nHave a productive day! 💪\n\n_Smart Study Planner_`;
        const result = await sendWhatsAppMessage(user.phoneNumber, message);
        res.status(200).json({ success: result.success, message: result.success ? 'Summary sent!' : result.error });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.sendOverdueAlert = async (req, res) => {
    try {
        const { taskName, dueTime } = req.body;
        const user = await User.findById(req.user.id);
        if (!user.phoneNumber) return res.status(400).json({ success: false, message: 'Phone number not set.' });
        if (!user.notificationPrefs?.overdueAlerts) return res.status(200).json({ success: true, message: 'Overdue alerts disabled.' });

        const message = `⚠️ *Overdue Task Alert - Smart Study Planner*\n\nYour task "${taskName}" is overdue!\nIt was due at: ${dueTime}\n\nPlease complete it now: http://localhost:5173\n\n_Smart Study Planner_`;
        const result = await sendWhatsAppMessage(user.phoneNumber, message);
        res.status(200).json({ success: result.success, message: result.success ? 'Alert sent!' : result.error });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateNotificationSettings = async (req, res) => {
    try {
        const { phoneNumber, notificationPrefs } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { phoneNumber, notificationPrefs }, { new: true });
        res.status(200).json({ success: true, message: 'Settings updated successfully!', data: { phoneNumber: user.phoneNumber, notificationPrefs: user.notificationPrefs } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getNotificationSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('phoneNumber notificationPrefs');
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};