import express from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';
import { signupValidator, loginValidator } from '../validators/authValidators.js';

const router = express.Router();

const cookieSecure = String(process.env.COOKIE_SECURE || '').toLowerCase() === 'true';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

// ✅ Helper: validation error response
function validationErrorResponse(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
}

// ✅ Helper: sanitize user object
function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email
  };
}

// ✅ Helper: send auth response with JWT + cookie
function sendAuthResponse(res, user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }

  const payload = {
    user: {
      id: user._id.toString(),
      email: user.email
    }
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: jwtExpiresIn });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: cookieSecure
  });

  return res.json({ user: sanitizeUser(user) });
}

// ✅ Test route to check JWT
router.get('/test-jwt', (req, res) => {
  const payload = { userId: "12345", name: "Sarah" }; // fake user data
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// ✅ Signup route
router.post('/signup', signupValidator, async (req, res, next) => {
  if (validationErrorResponse(req, res)) return;

  try {
    const { name, email, password } = req.body;
    const normalizedEmail = String(email).toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ errors: [{ msg: 'Email already in use' }] });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: normalizedEmail, passwordHash });

    return sendAuthResponse(res, user);
  } catch (err) {
    return next(err);
  }
});

// ✅ Login route
router.post('/login', loginValidator, async (req, res, next) => {
  if (validationErrorResponse(req, res)) return;

  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email).toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    return sendAuthResponse(res, user);
  } catch (err) {
    return next(err);
  }
});

// ✅ Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: cookieSecure
  });

  res.json({ message: 'Logged out' });
});

// ✅ Get current user route
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    return next(err);
  }
});

export default router;