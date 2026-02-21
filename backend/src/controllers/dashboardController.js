const Goal = require('../models/Goal');
const Task = require('../models/Task');
const User = require('../models/User');
const MoodLog = require('../models/MoodLog');
const Timetable = require('../models/Timetable');
const PomodoroSession = require('../models/PomodoroSession');
const mongoose = require('mongoose');

exports.getStats = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: 'User authentication failed' });
        }

        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // dates (Standardized to UTC Midnights, unless client provides local boundaries)
        const now = new Date();
        const { timeframe = 'all', startOfToday: clientStart, endOfToday: clientEnd } = req.query;

        const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));

        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        sevenDaysAgo.setUTCHours(0, 0, 0, 0);

        // ⭐ Use client-provided boundaries if available to match user's local day
        const startOfToday = clientStart ? new Date(clientStart) : new Date(now.getTime());
        if (!clientStart) startOfToday.setUTCHours(0, 0, 0, 0);

        const endOfToday = clientEnd ? new Date(clientEnd) : new Date(now.getTime());
        if (!clientEnd) endOfToday.setUTCHours(23, 59, 59, 999);

        const today = now.toISOString().split('T')[0]; // Current UTC date string
        const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];

        let timeframeFilter = { userId: userObjectId };

        if (timeframe === 'today') {
            timeframeFilter.$or = [
                { updatedAt: { $gte: startOfToday, $lte: endOfToday } },
                { dueDate: { $gte: startOfToday, $lte: endOfToday } }
            ];
        } else if (timeframe === 'week') {
            timeframeFilter.date = { $gte: sevenDaysAgo };
        } else if (timeframe === 'month') {
            timeframeFilter.date = { $gte: startOfMonth };
        }

        const [
            user, moodLogs, timetable, monthGoals,
            dailyTasksAgg, dailyStudy, categoricalAgg,
            monthlySessionsCount, sessionStats, taskStatsAgg,
            activityDates, tasksTodo, hourlyStudy, hourlyTasks, completedTasks
        ] = await Promise.all([
            User.findById(userId),
            MoodLog.find({ userId }).sort('-date').limit(7),
            Timetable.findOne({ userId }),
            Goal.find({ userId, type: 'monthly' }).sort('-createdAt').limit(4),

            Task.aggregate([
                { $match: { userId: userObjectId, completed: true, updatedAt: { $gte: sevenDaysAgo } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }, count: { $sum: 1 } } }
            ]),

            PomodoroSession.aggregate([
                { $match: { userId: userObjectId, date: { $gte: sevenDaysAgo } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, minutes: { $sum: "$duration" }, sessions: { $sum: 1 } } }
            ]),

            Task.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        $or: [
                            { updatedAt: { $gte: startOfMonth } },
                            { dueDate: { $gte: startOfMonth } }
                        ]
                    }
                },
                { $group: { _id: { type: "$type" }, total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] } } } }
            ]),

            PomodoroSession.countDocuments({ userId: userObjectId, date: { $gte: startOfMonth } }),

            PomodoroSession.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, totalSessions: { $sum: 1 }, totalMinutes: { $sum: "$duration" } } }
            ]),

            // ✅ FIXED: All task counts correct
            Task.aggregate([
                { $match: { userId: userObjectId } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        completed: { $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] } },
                        // Pending: Uncompleted AND Due >= Start of Today UTC
                        pending: { $sum: { $cond: [{ $and: [{ $eq: ["$completed", false] }, { $gte: ["$dueDate", startOfToday] }] }, 1, 0] } },
                        // Overdue: Uncompleted AND Due < Start of Today UTC
                        overdue: { $sum: { $cond: [{ $and: [{ $eq: ["$completed", false] }, { $lt: ["$dueDate", startOfToday] }] }, 1, 0] } },
                        // Due Today: Consistent Range comparison (UTC)
                        dueToday: { $sum: { $cond: [{ $and: [{ $gte: ["$dueDate", startOfToday] }, { $lte: ["$dueDate", endOfToday] }] }, 1, 0] } }
                    }
                }
            ]),

            PomodoroSession.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } } },
                {
                    $unionWith: {
                        coll: 'tasks',
                        pipeline: [
                            { $match: { userId: userObjectId, completed: true } },
                            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } } } }
                        ]
                    }
                },
                { $group: { _id: "$_id" } },
                { $sort: { _id: -1 } }
            ]),

            // ✅ All incomplete tasks for pending popup
            Task.find({ userId: userObjectId, completed: false }).sort('dueDate'),

            PomodoroSession.aggregate([
                { $match: timeframeFilter },
                { $group: { _id: { $hour: "$date" }, minutes: { $sum: "$duration" } } },
                { $sort: { "_id": 1 } }
            ]),

            Task.aggregate([
                { $match: { ...timeframeFilter, completed: true } },
                { $group: { _id: { $hour: { $ifNull: ["$updatedAt", "$dueDate"] } }, count: { $sum: 1 } } },
                { $sort: { "_id": 1 } }
            ]),

            Task.find({ userId: userObjectId, completed: true }).sort('-updatedAt').limit(20)
        ]);

        const taskStats = taskStatsAgg.length > 0 ? taskStatsAgg[0] : {
            total: 0, completed: 0, pending: 0, overdue: 0, dueToday: 0
        };
        const totalMinutes = sessionStats.length > 0 ? sessionStats[0].totalMinutes : 0;
        const totalHours = totalMinutes / 60;

        // Weekly Metrics
        const weeklyMetrics = [];
        let maxWeeklyHours = 1;
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const taskFound = dailyTasksAgg.find(t => t._id === dateStr);
            const studyFound = dailyStudy.find(s => s._id === dateStr);
            const hoursNum = studyFound ? parseFloat((studyFound.minutes / 60).toFixed(2)) : 0;
            if (hoursNum > maxWeeklyHours) maxWeeklyHours = hoursNum;
            weeklyMetrics.push({
                date: dateStr,
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                tasks: taskFound ? taskFound.count : 0,
                hours: hoursNum,
                minutes: studyFound ? studyFound.minutes : 0,
                sessions: studyFound ? studyFound.sessions : 0
            });
        }

        // Hourly Stats
        const hourlyStats = Array.from({ length: 24 }).map((_, i) => {
            const hourData = hourlyStudy.find(h => h._id === i);
            const taskHourData = hourlyTasks.find(h => h._id === i);
            const hourLabel = i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`;
            return { time: hourLabel, value: hourData ? hourData.minutes : 0, secondary: taskHourData ? taskHourData.count : 0, minutes: hourData ? hourData.minutes : 0 };
        });

        // Categorical
        const categoricalRaw = {
            'Tasks': { total: 0, completed: 0 },
            'Class': { total: 0, completed: 0 },
            'Exams': { total: 0, completed: 0 },
            'Focus': { total: 0, completed: 0 }
        };
        categoricalAgg.forEach(item => {
            const t = item._id.type?.toLowerCase();
            if (t === 'class') { categoricalRaw['Class'].total += item.total; categoricalRaw['Class'].completed += item.completed; }
            else if (t === 'exam') { categoricalRaw['Exams'].total += item.total; categoricalRaw['Exams'].completed += item.completed; }
            else { categoricalRaw['Tasks'].total += item.total; categoricalRaw['Tasks'].completed += item.completed; }
        });
        const categoricalData = Object.entries(categoricalRaw).map(([label, data]) => {
            let val = label === 'Focus' ? parseFloat((totalMinutes / 60).toFixed(1)) : (data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0);
            return { label, count: val };
        });

        // Streak (Standardized to UTC Strings)
        let currentStreak = 0;
        if (activityDates.length > 0) {
            const todayStr = now.toISOString().split('T')[0];
            const yesterdayDate = new Date(now.getTime() - 86400000);
            const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
            let lastDate = activityDates[0]._id;
            if (lastDate === todayStr || lastDate === yesterdayStr) {
                currentStreak = 1;
                for (let i = 1; i < activityDates.length; i++) {
                    const prev = new Date(activityDates[i - 1]._id);
                    const curr = new Date(activityDates[i]._id);
                    if (Math.round((prev - curr) / 86400000) === 1) currentStreak++;
                    else break;
                }
            }
        }

        // Productivity Score
        const completionRate = taskStats.total > 0 ? (taskStats.completed / taskStats.total) : 0;
        const avgMood = moodLogs.length > 0 ? (moodLogs.reduce((a, l) => a + l.mood, 0) / moodLogs.length) : 0;
        const weeklyStudyHours = weeklyMetrics.reduce((a, d) => a + d.hours, 0);
        const productivityScore = (taskStats.total > 0 || weeklyStudyHours > 0 || moodLogs.length > 0)
            ? Math.round((completionRate * 0.4 + Math.min(weeklyStudyHours / 28, 1) * 0.4 + (avgMood / 5) * 0.2) * 100)
            : 0;

        // ✅ DEBUG LOG — remove after confirming fix
        console.log('📊 Dashboard taskStats:', {
            total: taskStats.total,
            pending: taskStats.pending,
            overdue: taskStats.overdue,
            dueToday: taskStats.dueToday,
            completed: taskStats.completed
        });

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.status(200).json({
            success: true,
            data: {
                user: {
                    name: user ? user.name : 'User',
                    xp: user ? user.xp : 0,
                    level: user ? user.level : 1,
                    studyStats: { totalHours: totalHours.toFixed(1), totalMinutes, streak: currentStreak, productivityScore },
                    taskStats: { ...taskStats, upcomingTasks: tasksTodo, completedTasks },
                    badges: user ? user.badges : []
                },
                analytics: {
                    totalSessions: sessionStats.length > 0 ? sessionStats[0].totalSessions : 0,
                    totalMinutes, maxWeeklyHours, avgMood: avgMood > 0 ? avgMood.toFixed(1) : "0.0",
                    recentMoods: moodLogs, timetable: timetable ? timetable.schedule : [],
                    weeklyProgress: weeklyMetrics, categoricalProgress: categoricalData,
                    hourlyStats, monthGoals
                }
            }
        });

    } catch (err) {
        console.error('Dashboard error:', err);
        next(err);
    }
};