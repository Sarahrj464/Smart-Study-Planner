const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { signupValidator, loginValidator } = require('../validators/authValidators');

const router = express.Router();

// Helper to set cookie
function setTokenCookie(res, payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });

  const cookieOptions = {
    httpOnly: true,
    // secure should be true in production with HTTPS
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 // 1 hour
  };

  res.cookie('token', token, cookieOptions);
}

// POST /api/auth/signup
router.post('/signup', signupValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Email already in use' }] });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash
    });

    await user.save();

    setTokenCookie(res, { user: { id: user._id, email: user.email } });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

// POST /api/auth/login
router.post('/login', loginValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    setTokenCookie(res, { user: { id: user._id, email: user.email } });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ errors: [{ msg: 'User not found' }] });

    res.json({ user });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax'
  });
  res.json({ msg: 'Logged out' });
});

module.exports = router;