const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  relationship: {
    type: String,
    required: true,
    enum: ['spouse', 'child', 'parent', 'sibling', 'family'],
    default: 'family'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
familyMemberSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('FamilyMember', familyMemberSchema);
