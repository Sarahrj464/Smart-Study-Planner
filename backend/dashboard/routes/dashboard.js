const express = require('express');
const { body, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const authMiddleware = require('../../auth/middleware/auth'); // protects routes by cookie JWT
const { requireRole } = require('../middleware/role');

const StudySession = require('../models/StudySession');
const User = require('../../auth/models/User');

const router = express.Router();

/**
 * POST /api/dashboard/session
 * Body: { date?: ISOString, durationMinutes: number, focusedPercent: number }
 * Auth: any authenticated user (student/admin)
 */
router.post(
  '/session',
  authMiddleware,
  [
    body('durationMinutes').isInt({ min: 1 }).withMessage('durationMinutes must be >= 1'),
    body('focusedPercent').isFloat({ min: 0, max: 100 }).withMessage('focusedPercent between 0 and 100'),
    body('date').optional().isISO8601().toDate()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { durationMinutes, focusedPercent } = req.body;
      const date = req.body.date ? new Date(req.body.date) : new Date();

      const session = new StudySession({
        user: mongoose.Types.ObjectId(req.user.id),
        date,
        durationMinutes,
        focusedPercent
      });

      await session.save();
      res.status(201).json({ session });
    } catch (err) {
      console.error('Create session error', err);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  }
);

/**
 * GET /api/dashboard/analytics?days=30
 * Returns analytics for the authenticated user for the last N days
 * Auth: any authenticated user
 */
router.get(
  '/analytics',
  authMiddleware,
  [query('days').optional().isInt({ min: 1, max: 365 }).toInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const days = req.query.days || 30;
    const userId = mongoose.Types.ObjectId(req.user.id);

    try {
      const now = new Date();
      const startDate = new Date(now);
      startDate.setUTCDate(startDate.getUTCDate() - (days - 1));
      startDate.setUTCHours(0, 0, 0, 0);

      // Aggregate by date string
      const pipeline = [
        {
          $match: {
            user: userId,
            date: { $gte: startDate, $lte: now }
          }
        },
        {
          $addFields: {
            dateOnly: {
              $dateToString: { format: '%Y-%m-%d', date: '$date', timezone: 'UTC' }
            }
          }
        },
        {
          $group: {
            _id: '$dateOnly',
            minutes: { $sum: '$durationMinutes' },
            // weighted sum of focus (focus * minutes)
            focusWeighted: { $sum: { $multiply: ['$focusedPercent', '$durationMinutes'] } }
          }
        },
        { $sort: { _id: 1 } }
      ];

      const rows = await StudySession.aggregate(pipeline);

      // Build map date -> data
      const map = {};
      rows.forEach((r) => {
        map[r._id] = {
          minutes: r.minutes,
          focusAvg: r.minutes > 0 ? Math.round((r.focusWeighted / r.minutes) * 100) / 100 : 0
        };
      });

      // Build full daily array
      const daily = [];
      for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setUTCDate(startDate.getUTCDate() + i);
        const iso = d.toISOString().slice(0, 10);
        const entry = map[iso] || { minutes: 0, focusAvg: 0 };
        daily.push({ date: iso, ...entry });
      }

      // Totals
      const totalMinutes = daily.reduce((s, r) => s + r.minutes, 0);
      const totalHours = Math.round((totalMinutes / 60) * 100) / 100;

      // Average focus weighted across days (weighted by minutes)
      const totalFocusWeighted = daily.reduce((s, r) => s + r.focusAvg * r.minutes, 0);
      const avgFocus = totalMinutes ? Math.round((totalFocusWeighted / totalMinutes) * 100) / 100 : 0;

      // Streak calculations (current streak up to today and best streak)
      // We consider a "study day" any day with minutes > 0.
      let currentStreak = 0;
      let bestStreak = 0;
      let tempStreak = 0;

      // Compute current streak
      for (let i = daily.length - 1; i >= 0; i--) {
        if (daily[i].minutes > 0) currentStreak++;
        else break;
      }
      // Compute best streak by scanning forward
      tempStreak = 0;
      for (let i = 0; i < daily.length; i++) {
        if (daily[i].minutes > 0) {
          tempStreak++;
          if (tempStreak > bestStreak) bestStreak = tempStreak;
        } else {
          tempStreak = 0;
        }
      }

      res.json({
        summary: {
          totalHours,
          totalMinutes,
          avgFocus,
          currentStreak,
          bestStreak,
          days
        },
        daily // array of { date, minutes, focusAvg }
      });
    } catch (err) {
      console.error('Analytics error', err);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  }
);

/**
 * GET /api/dashboard/admin/overview
 * Admin-only endpoint summarizing platform metrics
 * Auth: admin
 */
router.get('/admin/overview', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    // total users
    const totalUsers = await User.countDocuments();

    // total study minutes and avg focus across all sessions
    const pipeline = [
      {
        $group: {
          _id: null,
          totalMinutes: { $sum: '$durationMinutes' },
          focusWeighted: { $sum: { $multiply: ['$focusedPercent', '$durationMinutes'] } },
          sessions: { $sum: 1 }
        }
      }
    ];

    const agg = await StudySession.aggregate(pipeline);
    const record = agg[0] || { totalMinutes: 0, focusWeighted: 0, sessions: 0 };

    const totalHours = Math.round((record.totalMinutes / 60) * 100) / 100;
    const avgFocus = record.totalMinutes ? Math.round((record.focusWeighted / record.totalMinutes) * 100) / 100 : 0;

    res.json({
      totalUsers,
      totalHours,
      avgFocus,
      totalSessions: record.sessions
    });
  } catch (err) {
    console.error('Admin overview error', err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

module.exports = router;
