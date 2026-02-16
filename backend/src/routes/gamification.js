const express = require('express');
const { updateXP, getBadges } = require('../controllers/gamificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/xp', updateXP);
router.get('/badges', getBadges);

module.exports = router;
