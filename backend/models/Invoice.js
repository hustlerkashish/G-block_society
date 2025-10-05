const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  flatNumber: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invoiceType: {
    type: String,
    enum: ['maintenance', 'parking', 'event', 'clubhouse', 'guesthouse', 'utility', 'other'],
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  items: [{
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    rate: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    gstRate: {
      type: Number,
      default: 0
    },
    gstAmount: {
      type: Number,
      default: 0
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  gstTotal: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'upi', 'card', 'cheque', 'online']
  },
  paymentDate: {
    type: Date
  },
  referenceNumber: {
    type: String
  },
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
  nextInvoiceDate: {
    type: Date
  },
  sentAt: {
    type: Date
  },
  paidAt: {
    type: Date
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

// Generate invoice number
invoiceSchema.pre('save', function(next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.invoiceNumber = `INV${year}${month}${random}`;
  }
  next();
});

// Calculate totals
invoiceSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.amount, 0);
    this.gstTotal = this.items.reduce((sum, item) => sum + item.gstAmount, 0);
    this.totalAmount = this.subtotal + this.gstTotal;
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
