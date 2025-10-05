// backend/routes/maintenance.js
const express = require("express");
const router = express.Router();
const Maintenance = require("../models/Maintenance");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Create new maintenance record (authenticated users)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const maintenance = new Maintenance({
      ...req.body,
      memberId: req.body.memberId || req.user._id // Use memberId from request body, fallback to current user
    });
    await maintenance.save();
    res.status(201).json(maintenance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all maintenance records (admin can see all, residents see only their own)
router.get("/", authenticateToken, async (req, res) => {
  try {
    let records;
    if (req.user.role === 'admin') {
      records = await Maintenance.find().populate("memberId", "username role homeNumber");
    } else {
      records = await Maintenance.find({ memberId: req.user._id }).populate("memberId", "username role homeNumber");
    }
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update maintenance status (admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updated = await Maintenance.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate("memberId", "username role homeNumber");
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete maintenance record (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
