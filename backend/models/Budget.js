const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    min: 1,
    max: 12
  },
  category: {
    type: String,
    required: true,
    enum: ['maintenance', 'utility', 'repair', 'salary', 'security', 'housekeeping', 'admin', 'event', 'donation', 'other']
  },
  subCategory: {
    type: String,
    required: true
  },
  budgetedAmount: {
    type: Number,
    required: true,
    min: 0
  },
  actualAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  variance: {
    type: Number,
    default: 0
  },
  variancePercentage: {
    type: Number,
    default: 0
  },
  description: {
    type: String
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringFrequency: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly']
  },
  status: {
    type: String,
    enum: ['draft', 'approved', 'active', 'completed'],
    default: 'draft'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Calculate variance and variance percentage
budgetSchema.pre('save', function(next) {
  if (this.budgetedAmount > 0) {
    this.variance = this.actualAmount - this.budgetedAmount;
    this.variancePercentage = (this.variance / this.budgetedAmount) * 100;
  }
  next();
});

module.exports = mongoose.model('Budget', budgetSchema);
