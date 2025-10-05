const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { authenticateToken } = require('../middleware/auth');

// Get user's bookings
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    // Ensure user can only access their own bookings
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('eventId', 'title date time location capacity attendees isPaid price')
      .sort({ bookedAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const bookings = await Booking.find()
      .populate('userId', 'username homeNumber name email phone')
      .populate('eventId', 'title date time location capacity attendees')
      .sort({ bookedAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { eventId, attendees, specialRequirements, amount } = req.body;

    // Check if event exists and has capacity
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.attendees + attendees > event.capacity) {
      return res.status(400).json({ error: 'Event capacity exceeded' });
    }

    // Remove the duplicate booking check to allow multiple bookings
    // const existingBooking = await Booking.findOne({ userId: req.user._id, eventId });
    // if (existingBooking) {
    //   return res.status(400).json({ error: 'You have already booked this event' });
    // }

    const booking = new Booking({
      userId: req.user._id,
      eventId,
      attendees,
      specialRequirements,
      amount: amount || 0,
      status: 'confirmed'
    });

    await booking.save();

    // Update event attendees count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { attendees: attendees }
    });

    // Return populated booking data
    const populatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'username homeNumber name email phone')
      .populate('eventId', 'title date time location');

    res.status(201).json(populatedBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update booking status (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('eventId').populate('userId', 'username');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cancel booking
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Ensure user can only cancel their own booking (unless admin)
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update event attendees count
    await Event.findByIdAndUpdate(booking.eventId, {
      $inc: { attendees: -booking.attendees }
    });

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 