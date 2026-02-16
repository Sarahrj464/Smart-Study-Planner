const Goal = require('../models/Goal');
const Task = require('../models/Task');
const User = require('../models/User');
const MoodLog = require('../models/MoodLog');
const Timetable = require('../models/Timetable');
const PomodoroSession = require('../models/PomodoroSession');
const mongoose = require('mongoose');

// @desc    Get dashboard stats
// @route   GET /api/v1/dashboard
// @access  Private
exports.getStats = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: 'User authentication failed' });
        }

        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // dates
        const now = new Date();
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // 1. Fetch EVERYTHING (Parallel)
        const [
            user,
            moodLogs,
            timetable,
            monthGoals,
            dailyTasks,
            dailyStudy,
            categoricalAgg,
            monthlySessionsCount,
            sessionStats,
            taskStatsAgg,
            activityDates,
            tasksTodo,
            hourlyStudy // New aggregation
        ] = await Promise.all([
            User.findById(userId),
            MoodLog.find({ userId }).sort('-date').limit(7),
            Timetable.findOne({ userId }),
            Goal.find({ userId, type: 'monthly' }).sort('-createdAt').limit(4),
            // Weekly Task Count
            Task.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        completed: true,
                        updatedAt: { $gte: sevenDaysAgo }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                        count: { $sum: 1 }
                    }
                }
            ]),
            // Weekly Study Minutes
            PomodoroSession.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        date: { $gte: sevenDaysAgo }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        minutes: { $sum: "$duration" },
                        sessions: { $sum: 1 }
                    }
                }
            ]),
            // Categorical Stats (Month)
            Task.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        $or: [
                            { updatedAt: { $gte: startOfMonth } },
                            { dueDate: { $gte: startOfMonth, $lt: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1) } }
                        ]
                    }
                },
                {
                    $group: {
                        _id: { type: "$type" },
                        total: { $sum: 1 },
                        completed: { $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] } }
                    }
                }
            ]),
            // Monthly Focus Sessions Count
            PomodoroSession.countDocuments({
                userId: userObjectId,
                date: { $gte: startOfMonth }
            }),
            // Total Session Stats
            PomodoroSession.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, totalSessions: { $sum: 1 }, totalMinutes: { $sum: "$duration" } } }
            ]),
            // Total Task Stats
            Task.aggregate([
                { $match: { userId: userObjectId } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        completed: { $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] } },
                        pending: { $sum: { $cond: [{ $and: [{ $eq: ["$completed", false] }, { $gte: ["$dueDate", now] }] }, 1, 0] } },
                        overdue: { $sum: { $cond: [{ $and: [{ $eq: ["$completed", false] }, { $lt: ["$dueDate", now] }] }, 1, 0] } }
                    }
                }
            ]),
            // Streak Dates
            PomodoroSession.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } } },
                { $unionWith: { coll: 'tasks', pipeline: [{ $match: { userId: userObjectId, completed: true } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } } } }] } },
                { $group: { _id: "$_id" } },
                { $sort: { _id: -1 } }
            ]),
            // Pending Tasks List
            Task.find({ userId, completed: false }).sort('dueDate'),
            // Hourly Study Aggregation (New!)
            PomodoroSession.aggregate([
                { $match: { userId: userObjectId } },
                {
                    $group: {
                        _id: { $hour: "$date" },
                        minutes: { $sum: "$duration" }
                    }
                },
                { $sort: { "_id": 1 } }
            ])
        ]);

        // 2. Overall Stats & Totals
        const taskStats = taskStatsAgg.length > 0 ? taskStatsAgg[0] : { total: 0, completed: 0, pending: 0, overdue: 0 };
        const totalMinutes = sessionStats.length > 0 ? sessionStats[0].totalMinutes : 0;
        const totalHours = (totalMinutes / 60);

        // 3. Weekly Metrics
        const weeklyMetrics = [];
        let maxWeeklyHours = 1;

        // Date matching fix: use local date string logic for the loop
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);

            // Format to YYYY-MM-DD in UTC to match Mongo $dateToString
            const year = d.getUTCFullYear();
            const month = String(d.getUTCMonth() + 1).padStart(2, '0');
            const day = String(d.getUTCDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const taskFound = dailyTasks.find(t => t._id === dateStr);
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

        // 4. Hourly Insights Mapping
        const hourlyStats = Array.from({ length: 24 }).map((_, i) => {
            const hourData = hourlyStudy.find(h => h._id === i);
            const hourLabel = i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`;
            return {
                time: hourLabel,
                value: hourData ? hourData.minutes * 60 : 0, // In "score" scale like the chart expects (or just minutes)
                minutes: hourData ? hourData.minutes : 0
            };
        });

        // 5. Categorical Progress
        const categoricalRaw = {
            'Tasks': { total: 0, completed: 0 },
            'Class': { total: 0, completed: 0 },
            'Exams': { total: 0, completed: 0 },
            'Focus': { total: 0, completed: 0 }
        };

        categoricalAgg.forEach(item => {
            const typeValue = item._id.type;
            if (typeValue === 'Class') {
                categoricalRaw['Class'].total += item.total;
                categoricalRaw['Class'].completed += item.completed;
            } else if (typeValue === 'Exam') {
                categoricalRaw['Exams'].total += item.total;
                categoricalRaw['Exams'].completed += item.completed;
            } else {
                categoricalRaw['Tasks'].total += item.total;
                categoricalRaw['Tasks'].completed += item.completed;
            }
        });

        const categoricalData = Object.entries(categoricalRaw).map(([label, data]) => {
            let val = 0;
            if (label === 'Focus') {
                val = parseFloat((totalMinutes / 60).toFixed(1));
            } else {
                val = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
            }
            return { label, count: val };
        });

        // 6. Streak Calculation
        let currentStreak = 0;
        if (activityDates.length > 0) {
            const todayUTC = new Date().toISOString().split('T')[0];
            const yesterdayUTC = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            let lastDate = activityDates[0]._id;

            if (lastDate === todayUTC || lastDate === yesterdayUTC) {
                currentStreak = 1;
                for (let i = 1; i < activityDates.length; i++) {
                    const prevDate = new Date(activityDates[i - 1]._id);
                    const currDate = new Date(activityDates[i]._id);
                    const diffDays = Math.round((prevDate - currDate) / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
            }
        }

        // 7. Productivity Score
        const completionRate = taskStats.total > 0 ? (taskStats.completed / taskStats.total) : 0;
        const avgMood = moodLogs.length > 0 ? (moodLogs.reduce((acc, log) => acc + log.mood, 0) / moodLogs.length) : 0;
        const moodFactor = avgMood / 5;
        const weeklyStudyHours = weeklyMetrics.reduce((acc, d) => acc + d.hours, 0);
        const studyIntensity = Math.min(weeklyStudyHours / 28, 1);

        const hasActivity = taskStats.total > 0 || weeklyStudyHours > 0 || moodLogs.length > 0;
        const productivityScore = hasActivity ? Math.round(
            (completionRate * 0.4 + studyIntensity * 0.4 + moodFactor * 0.2) * 100
        ) : 0;

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.status(200).json({
            success: true,
            data: {
                user: {
                    name: user ? user.name : 'User',
                    xp: user ? user.xp : 0,
                    level: user ? user.level : 1,
                    studyStats: {
                        totalHours: totalHours.toFixed(1),
                        totalMinutes: totalMinutes,
                        streak: currentStreak,
                        productivityScore
                    },
                    taskStats: {
                        ...taskStats,
                        upcomingTasks: tasksTodo
                    },
                    badges: user ? user.badges : []
                },
                analytics: {
                    totalSessions: sessionStats.length > 0 ? sessionStats[0].totalSessions : 0,
                    totalMinutes,
                    maxWeeklyHours,
                    avgMood: avgMood > 0 ? avgMood.toFixed(1) : "0.0",
                    recentMoods: moodLogs,
                    timetable: timetable ? timetable.schedule : [],
                    weeklyProgress: weeklyMetrics,
                    categoricalProgress: categoricalData,
                    hourlyStats, // New!
                    monthGoals
                }
            }
        });

    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        next(err);
    }
};
