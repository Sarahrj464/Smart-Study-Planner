const User = require('../models/User');

// @desc    Update user XP and check for level ups/badges
// @route   POST /api/v1/gamification/xp
// @access  Private
exports.updateXP = async (req, res, next) => {
    try {
        const { xpToAdd } = req.body;
        const user = await User.findById(req.user.id);

        user.xp += xpToAdd;

        // Simple Leveling Logic: Level = floor(sqrt(xp / 100)) + 1
        const newLevel = Math.floor(Math.sqrt(user.xp / 100)) + 1;

        if (newLevel > user.level) {
            user.level = newLevel;
            // Add a badge for leveling up if it doesn't exist
            const badgeName = `Level ${newLevel} Achiever`;
            if (!user.badges.includes(badgeName)) {
                user.badges.push(badgeName);
            }
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: {
                xp: user.xp,
                level: user.level,
                badges: user.badges
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user badges
// @route   GET /api/v1/gamification/badges
// @access  Private
exports.getBadges = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('badges');
        res.status(200).json({ success: true, data: user.badges });
    } catch (err) {
        next(err);
    }
};
