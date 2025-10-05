const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all events
router.get('/', authenticateToken, async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'username');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new event (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      createdBy: req.user._id
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update event (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('createdBy', 'username');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete event (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get event by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'username');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 