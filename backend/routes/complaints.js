const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all complaints (admin can see all, residents see only their own)
router.get("/", authenticateToken, async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'admin') {
      complaints = await Complaint.find().populate("userId", "username role homeNumber");
    } else {
      complaints = await Complaint.find({ userId: req.user._id }).populate("userId", "username role homeNumber");
    }
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new complaint
router.post("/", authenticateToken, async (req, res) => {
  try {
    const complaint = new Complaint({
      ...req.body,
      userId: req.user._id
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update complaint (admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    res.json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete complaint (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 