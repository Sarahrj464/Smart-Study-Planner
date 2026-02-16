// role.js - role-check middleware
// Usage: const requireAdmin = require('./middleware/role').requireAdmin;
const User = require('../../auth/models/User');

/**
 * Loads the user from DB and attaches to req.userDoc. Treats missing role as 'student'.
 */
async function loadUserDoc(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
    }
    const userDoc = await User.findById(req.user.id).select('-passwordHash');
    if (!userDoc) return res.status(401).json({ errors: [{ msg: 'User not found' }] });
    req.userDoc = userDoc;
    next();
  } catch (err) {
    console.error('loadUserDoc error', err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
}

function requireRole(role) {
  return [
    loadUserDoc,
    (req, res, next) => {
      const userRole = req.userDoc?.role || 'student';
      if (userRole !== role) {
        return res.status(403).json({ errors: [{ msg: 'Forbidden: insufficient permissions' }] });
      }
      next();
    }
  ];
}

module.exports = { loadUserDoc, requireRole };