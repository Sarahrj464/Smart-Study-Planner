const Task = require('../models/Task');
const User = require('../models/User');
const { sendWhatsAppMessage } = require('./whatsappService');

const startNotificationJob = () => {
    // Run every 1 minute
    setInterval(async () => {
        try {
            const now = new Date();

            // Find tasks where:
            // 1. Not completed
            // 2. Overdue alert not sent yet
            // 3. Due date is in the past
            const overdueTasks = await Task.find({
                completed: false,
                overdueAlertSent: false,
                dueDate: { $lte: now }
            });

            if (overdueTasks.length === 0) return;

            console.log(`🔍 Found ${overdueTasks.length} potential overdue tasks for notification.`);

            for (const task of overdueTasks) {
                // Double check time comparison since dueDate is just the date part sometimes
                // We need to compare full ISO string or combine with 'time' string if necessary
                // For now, assume dueDate includes time or we just trigger if its the due day

                const user = await User.findById(task.userId);
                if (!user || !user.phoneNumber || !user.notificationPrefs?.overdueAlerts) {
                    // Skip if user doesn't want alerts or has no phone
                    task.overdueAlertSent = true;
                    await task.save();
                    continue;
                }

                const message = `⚠️ *Overdue Alert!*\n\n"${task.title}" overdue ho gaya!\nDue tha: ${task.time || 'N/A'}\n\nAbhi complete karo: http://localhost:5173\n\n_Smart Study Planner_`;

                const result = await sendWhatsAppMessage(user.phoneNumber, message);

                if (result.success) {
                    task.overdueAlertSent = true;
                    await task.save();
                } else {
                    console.error(`❌ Failed to send overdue alert for task ${task._id}: ${result.error}`);
                }
            }
        } catch (error) {
            console.error('❌ Notification Job Error:', error);
        }
    }, 60000); // 1 minute
};

module.exports = { startNotificationJob };
