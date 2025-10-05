const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FamilyMember = require('../models/FamilyMember');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + req.user._id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get user profile
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    // Ensure user can only access their own profile (unless admin)
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/:userId', authenticateToken, async (req, res) => {
  try {
    // Ensure user can only update their own profile (unless admin)
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, email, phone } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Upload profile photo
router.put('/:userId/photo', authenticateToken, upload.single('profilePhoto'), async (req, res) => {
  try {
    // Ensure user can only update their own profile (unless admin)
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update profile photo path
    user.profilePhoto = `/uploads/profiles/${req.file.filename}`;
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Change password
router.put('/:userId/password', authenticateToken, async (req, res) => {
  try {
    // Ensure user can only change their own password (unless admin)
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password (unless admin)
    if (req.user.role !== 'admin') {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
    }

    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get family members
router.get('/family/:userId', authenticateToken, async (req, res) => {
  try {
    // Ensure user can only access their own family (unless admin)
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const familyMembers = await FamilyMember.find({ userId: req.params.userId });
    res.json(familyMembers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add family member
router.post('/family/:userId', authenticateToken, async (req, res) => {
  try {
    // Ensure user can only add to their own family (unless admin)
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, age, phone, relationship } = req.body;
    
    const familyMember = new FamilyMember({
      userId: req.params.userId,
      name,
      age,
      phone,
      relationship
    });

    await familyMember.save();
    res.status(201).json(familyMember);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete family member
router.delete('/family/:userId/:memberId', authenticateToken, async (req, res) => {
  try {
    // Ensure user can only delete from their own family (unless admin)
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const familyMember = await FamilyMember.findOneAndDelete({
      _id: req.params.memberId,
      userId: req.params.userId
    });

    if (!familyMember) {
      return res.status(404).json({ error: 'Family member not found' });
    }

    res.json({ message: 'Family member deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
