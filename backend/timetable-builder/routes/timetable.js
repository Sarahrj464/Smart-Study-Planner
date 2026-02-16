const express = require('express');
const { validationResult } = require('express-validator');
const Timetable = require('../models/TimeTable');
const authMiddleware = require('../../auth/middleware/auth');
const { createValidator, updateValidator, idParamValidator } = require('../validators/timetableValidators');

const router = express.Router();

/**
 * POST /api/timetable
 * Create a timetable (authenticated)
 */
router.post('/', authMiddleware, createValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, columns } = req.body;
    const timetable = new Timetable({
      user: req.user.id,
      name,
      columns
    });
    await timetable.save();
    res.status(201).json({ timetable });
  } catch (err) {
    console.error('Create timetable error', err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

/**
 * GET /api/timetable
 * Get all timetables for the current user
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const timetables = await Timetable.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json({ timetables });
  } catch (err) {
    console.error('List timetables error', err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

/**
 * GET /api/timetable/:id
 * Get single timetable (must belong to user)
 */
router.get('/:id', authMiddleware, idParamValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) return res.status(404).json({ errors: [{ msg: 'Not found' }] });
    if (timetable.user.toString() !== req.user.id)
      return res.status(403).json({ errors: [{ msg: 'Forbidden' }] });
    res.json({ timetable });
  } catch (err) {
    console.error('Get timetable error', err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

/**
 * PUT /api/timetable/:id
 * Update timetable (must belong to user)
 */
router.put('/:id', authMiddleware, updateValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) return res.status(404).json({ errors: [{ msg: 'Not found' }] });
    if (timetable.user.toString() !== req.user.id)
      return res.status(403).json({ errors: [{ msg: 'Forbidden' }] });

    timetable.name = req.body.name;
    timetable.columns = req.body.columns;
    await timetable.save();
    res.json({ timetable });
  } catch (err) {
    console.error('Update timetable error', err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

/**
 * DELETE /api/timetable/:id
 * Delete timetable (must belong to user)
 */
router.delete('/:id', authMiddleware, idParamValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) return res.status(404).json({ errors: [{ msg: 'Not found' }] });
    if (timetable.user.toString() !== req.user.id)
      return res.status(403).json({ errors: [{ msg: 'Forbidden' }] });

    await timetable.deleteOne();
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error('Delete timetable error', err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

module.exports = router;
