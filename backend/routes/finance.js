const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/finance';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image, PDF and document files are allowed!'));
    }
  }
});

// ==================== DASHBOARD & OVERVIEW ====================

// Get finance dashboard overview
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Get current month's data
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    // Total Income (current month)
    const totalIncome = await Transaction.aggregate([
      {
        $match: {
          type: 'income',
          date: { $gte: startOfMonth, $lte: endOfMonth },
          status: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Total Expenses (current month)
    const totalExpenses = await Transaction.aggregate([
      {
        $match: {
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
          status: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Pending Dues
    const pendingDues = await Transaction.aggregate([
      {
        $match: {
          type: 'income',
          status: { $in: ['pending', 'overdue'] },
          dueDate: { $lte: currentDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Cash/Bank Balance (simplified calculation)
    const allIncome = await Transaction.aggregate([
      {
        $match: {
          type: 'income',
          status: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const allExpenses = await Transaction.aggregate([
      {
        $match: {
          type: 'expense',
          status: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const balance = (allIncome[0]?.total || 0) - (allExpenses[0]?.total || 0);

    // Monthly chart data (last 12 months)
    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(currentYear - 1, currentMonth - 1, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Category-wise breakdown
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: {
            type: '$type',
            category: '$category'
          },
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      overview: {
        totalIncome: totalIncome[0]?.total || 0,
        totalExpenses: totalExpenses[0]?.total || 0,
        pendingDues: pendingDues[0]?.total || 0,
        pendingCount: pendingDues[0]?.count || 0,
        balance: balance,
        netIncome: (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0)
      },
      monthlyData,
      categoryBreakdown
    });
  } catch (error) {
    console.error('Error fetching finance dashboard:', error);
    res.status(500).json({ message: 'Error fetching finance dashboard' });
  }
});

// ==================== TRANSACTIONS ====================

// Get all transactions with filters
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const {
      type,
      category,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      search
    } = req.query;

    const query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { flatNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Only add date filter if both dates are valid
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        query.date = {
          $gte: start,
          $lte: end
        };
      }
    }

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(query)
      .populate('userId', 'name homeNumber')
      .populate('approvedBy', 'name')
      .populate('createdBy', 'name')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalRecords: total
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// Create new transaction
router.post('/transactions', authenticateToken, upload.array('attachments', 5), async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['type', 'category', 'subCategory', 'amount', 'description', 'relatedTo'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    const amount = parseFloat(req.body.amount);
    const gstAmount = parseFloat(req.body.gstAmount) || 0;
    const totalAmount = amount + gstAmount;

    // Generate transaction ID manually
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const transactionId = `TXN${year}${month}${random}`;

    const transactionData = {
      transactionId: transactionId,
      type: req.body.type,
      category: req.body.category,
      subCategory: req.body.subCategory,
      amount: amount,
      description: req.body.description,
      relatedTo: req.body.relatedTo,
      gstAmount: gstAmount,
      totalAmount: totalAmount,
      status: req.body.status || 'pending',
      paymentMethod: req.body.paymentMethod || 'cash',
      flatNumber: req.body.flatNumber,
      userId: req.body.userId,
      notes: req.body.notes,
      isRecurring: req.body.isRecurring === 'true',
      recurringFrequency: req.body.recurringFrequency,
      createdBy: req.user._id
    };

    // Handle date parsing safely
    if (req.body.date) {
      const parsedDate = new Date(req.body.date);
      if (!isNaN(parsedDate.getTime())) {
        transactionData.date = parsedDate;
      }
    }

    if (req.body.dueDate) {
      const parsedDueDate = new Date(req.body.dueDate);
      if (!isNaN(parsedDueDate.getTime())) {
        transactionData.dueDate = parsedDueDate;
      }
    }

    if (req.body.nextDueDate) {
      const parsedNextDueDate = new Date(req.body.nextDueDate);
      if (!isNaN(parsedNextDueDate.getTime())) {
        transactionData.nextDueDate = parsedNextDueDate;
      }
    }

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      transactionData.attachments = req.files.map(file => ({
        filename: file.originalname,
        path: file.path
      }));
    }

    const transaction = new Transaction(transactionData);
    await transaction.save();

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('userId', 'name homeNumber')
      .populate('createdBy', 'name');

    res.status(201).json(populatedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Error creating transaction' });
  }
});

// Update transaction
router.put('/transactions/:id', authenticateToken, upload.array('attachments', 5), async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Validate required fields
    const requiredFields = ['type', 'category', 'subCategory', 'amount', 'description', 'relatedTo'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    const amount = parseFloat(req.body.amount);
    const gstAmount = parseFloat(req.body.gstAmount) || 0;
    const totalAmount = amount + gstAmount;

    const updateData = {
      type: req.body.type,
      category: req.body.category,
      subCategory: req.body.subCategory,
      amount: amount,
      description: req.body.description,
      relatedTo: req.body.relatedTo,
      gstAmount: gstAmount,
      totalAmount: totalAmount,
      status: req.body.status,
      paymentMethod: req.body.paymentMethod,
      flatNumber: req.body.flatNumber,
      userId: req.body.userId,
      notes: req.body.notes,
      isRecurring: req.body.isRecurring === 'true',
      recurringFrequency: req.body.recurringFrequency,
      updatedBy: req.user._id
    };

    // Handle date parsing safely
    if (req.body.date) {
      const parsedDate = new Date(req.body.date);
      if (!isNaN(parsedDate.getTime())) {
        updateData.date = parsedDate;
      }
    }

    if (req.body.dueDate) {
      const parsedDueDate = new Date(req.body.dueDate);
      if (!isNaN(parsedDueDate.getTime())) {
        updateData.dueDate = parsedDueDate;
      }
    }

    if (req.body.nextDueDate) {
      const parsedNextDueDate = new Date(req.body.nextDueDate);
      if (!isNaN(parsedNextDueDate.getTime())) {
        updateData.nextDueDate = parsedNextDueDate;
      }
    }

    // Handle new file attachments
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        filename: file.originalname,
        path: file.path
      }));
      updateData.attachments = [...transaction.attachments, ...newAttachments];
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('userId', 'name homeNumber')
     .populate('approvedBy', 'name')
     .populate('createdBy', 'name');

    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Error updating transaction' });
  }
});

// Delete transaction
router.delete('/transactions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Delete associated files
    if (transaction.attachments) {
      transaction.attachments.forEach(attachment => {
        if (fs.existsSync(attachment.path)) {
          fs.unlinkSync(attachment.path);
        }
      });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Error deleting transaction' });
  }
});

// ==================== BUDGETS ====================

// Get all budgets
router.get('/budgets', authenticateToken, async (req, res) => {
  try {
    const { year, month, category, status } = req.query;
    const query = {};

    if (year) query.year = parseInt(year);
    if (month) query.month = parseInt(month);
    if (category) query.category = category;
    if (status) query.status = status;

    const budgets = await Budget.find(query)
      .populate('approvedBy', 'name')
      .populate('createdBy', 'name')
      .sort({ year: -1, month: -1 });

    res.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ message: 'Error fetching budgets' });
  }
});

// Create new budget
router.post('/budgets', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const budgetData = {
      ...req.body,
      budgetedAmount: parseFloat(req.body.budgetedAmount),
      createdBy: req.user._id
    };

    const budget = new Budget(budgetData);
    await budget.save();

    const populatedBudget = await Budget.findById(budget._id)
      .populate('createdBy', 'name');

    res.status(201).json(populatedBudget);
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ message: 'Error creating budget' });
  }
});

// Update budget
router.put('/budgets/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      budgetedAmount: parseFloat(req.body.budgetedAmount),
      updatedBy: req.user._id
    };

    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('approvedBy', 'name')
     .populate('createdBy', 'name');

    res.json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ message: 'Error updating budget' });
  }
});

// Approve budget
router.patch('/budgets/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedBy: req.user._id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('approvedBy', 'name')
     .populate('createdBy', 'name');

    res.json(budget);
  } catch (error) {
    console.error('Error approving budget:', error);
    res.status(500).json({ message: 'Error approving budget' });
  }
});

// ==================== INVOICES ====================

// Get all invoices
router.get('/invoices', authenticateToken, async (req, res) => {
  try {
    const {
      status,
      invoiceType,
      flatNumber,
      month,
      year,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // If user is not admin, only show their invoices
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    if (status) query.status = status;
    if (invoiceType) query.invoiceType = invoiceType;
    if (flatNumber) query.flatNumber = flatNumber;
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const skip = (page - 1) * limit;

    const invoices = await Invoice.find(query)
      .populate('userId', 'name homeNumber')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Invoice.countDocuments(query);

    res.json({
      invoices,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalRecords: total
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Error fetching invoices' });
  }
});

// Create new invoice
router.post('/invoices', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const invoiceData = {
      ...req.body,
      items: req.body.items.map(item => ({
        ...item,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate),
        amount: parseFloat(item.amount),
        gstRate: parseFloat(item.gstRate) || 0,
        gstAmount: parseFloat(item.gstAmount) || 0
      })),
      createdBy: req.user._id
    };

    const invoice = new Invoice(invoiceData);
    await invoice.save();

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('userId', 'name homeNumber')
      .populate('createdBy', 'name');

    res.status(201).json(populatedInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ message: 'Error creating invoice' });
  }
});

// Update invoice
router.put('/invoices/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      items: req.body.items.map(item => ({
        ...item,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate),
        amount: parseFloat(item.amount),
        gstRate: parseFloat(item.gstRate) || 0,
        gstAmount: parseFloat(item.gstAmount) || 0
      })),
      updatedBy: req.user._id
    };

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('userId', 'name homeNumber')
     .populate('createdBy', 'name');

    res.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ message: 'Error updating invoice' });
  }
});

// Mark invoice as paid
router.patch('/invoices/:id/pay', authenticateToken, async (req, res) => {
  try {
    const { paymentMethod, referenceNumber } = req.body;
    
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check if user can pay this invoice
    if (req.user.role !== 'admin' && invoice.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to pay this invoice' });
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        status: 'paid',
        paymentMethod,
        referenceNumber,
        paymentDate: new Date(),
        paidAt: new Date()
      },
      { new: true }
    ).populate('userId', 'name homeNumber')
     .populate('createdBy', 'name');

    res.json(updatedInvoice);
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    res.status(500).json({ message: 'Error marking invoice as paid' });
  }
});

// ==================== REPORTS ====================

// Generate financial report
router.get('/reports/financial', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Only add date filter if both dates are valid
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        query.date = {
          $gte: start,
          $lte: end
        };
      }
    }
    if (type) query.type = type;

    const transactions = await Transaction.find(query)
      .populate('userId', 'name homeNumber')
      .sort({ date: 1 });

    const summary = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            type: '$type',
            category: '$category'
          },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      transactions,
      summary,
      period: { startDate, endDate }
    });
  } catch (error) {
    console.error('Error generating financial report:', error);
    res.status(500).json({ message: 'Error generating financial report' });
  }
});

// Get outstanding dues report
router.get('/reports/dues', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const dues = await Transaction.find({
      type: 'income',
      status: { $in: ['pending', 'overdue'] }
    })
    .populate('userId', 'name homeNumber')
    .sort({ dueDate: 1 });

    const summary = await Transaction.aggregate([
      {
        $match: {
          type: 'income',
          status: { $in: ['pending', 'overdue'] }
        }
      },
      {
        $group: {
          _id: '$status',
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ dues, summary });
  } catch (error) {
    console.error('Error generating dues report:', error);
    res.status(500).json({ message: 'Error generating dues report' });
  }
});

module.exports = router;
