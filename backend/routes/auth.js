const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET;

// Register (admin only)
router.post('/register', authenticateToken, requireAdmin, async (req, res) => {
  const { username, password, role, homeNumber } = req.body;
  try {
    const user = new User({ username, password, role, homeNumber });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ 
    token, 
    _id: user._id,
    role: user.role, 
    username: user.username, 
    homeNumber: user.homeNumber,
    name: user.name,
    email: user.email,
    phone: user.phone
  });
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) return res.status(401).json({ message: 'Old password incorrect' });
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password changed successfully' });
});

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user (admin only)
router.put('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password only if provided
    if (password) {
      user.password = password;
    }

    // Update other fields
    Object.assign(user, updateData);
    await user.save();

    const { password: _, ...userResponse } = user.toObject();
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 