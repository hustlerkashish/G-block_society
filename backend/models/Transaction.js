const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'upi', 'card', 'cheque', 'online'],
    default: 'cash'
  },
  referenceNumber: {
    type: String
  },
  relatedTo: {
    type: String,
    enum: ['maintenance', 'rent', 'donation', 'parking', 'event', 'clubhouse', 'guesthouse', 'utility', 'repair', 'salary', 'vendor', 'other'],
    required: true
  },
  flatNumber: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  attachments: [{
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
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
  nextDueDate: {
    type: Date
  },
  gstAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
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

// Generate transaction ID
transactionSchema.pre('save', function(next) {
  if (!this.transactionId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.transactionId = `TXN${year}${month}${random}`;
  }
  
  // Ensure totalAmount is calculated
  if (this.amount !== undefined && this.gstAmount !== undefined) {
    this.totalAmount = this.amount + this.gstAmount;
  }
  
  next();
});

// Calculate total amount including GST (moved to the main pre-save hook above)

module.exports = mongoose.model('Transaction', transactionSchema);
