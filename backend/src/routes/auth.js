const express = require('express');
const upload = require('../middleware/upload');
const { signup, login, logout, getMe, updateDetails } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validator');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, upload.single('avatar'), updateDetails);

module.exports = router;
