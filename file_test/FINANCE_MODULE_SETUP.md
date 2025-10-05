# 🏦 Accounting & Finance Module - Setup Guide

## 📋 Overview

The Accounting & Finance Module is a comprehensive financial management system for the Society Management application. It provides complete financial tracking, budgeting, invoicing, and reporting capabilities.

## ✨ Features Implemented

### 1. **Finance Dashboard**
- **Total Income/Expenses**: Real-time financial overview
- **Pending Dues**: Outstanding payment tracking
- **Cash/Bank Balance**: Current financial position
- **Monthly Charts**: Visual financial trends
- **Category Breakdown**: Income/expense categorization

### 2. **Transaction Management**
- **Income Tracking**: Maintenance fees, rent, donations, parking, events
- **Expense Management**: Utilities, repairs, salaries, vendor payments
- **GST Support**: Tax calculation and tracking
- **File Attachments**: Receipt and document uploads
- **Recurring Transactions**: Automated recurring entries
- **Payment Methods**: Cash, UPI, cards, bank transfer, cheques

### 3. **Budget Management**
- **Annual/Monthly Budgets**: Budget planning and tracking
- **Budget vs Actual**: Variance analysis
- **Approval Workflow**: Committee approval system
- **Recurring Budgets**: Automated budget creation

### 4. **Invoice System**
- **Invoice Generation**: Automated invoice creation
- **Multiple Types**: Maintenance, parking, events, clubhouse
- **GST Calculation**: Automatic tax computation
- **Payment Tracking**: Status monitoring
- **Recurring Invoices**: Automated billing

### 5. **Reports & Analytics**
- **Financial Reports**: Monthly/quarterly/yearly reports
- **Dues Reports**: Outstanding payment analysis
- **Category Reports**: Income/expense breakdown
- **Export Capabilities**: PDF/Excel export

## 🛠 Technical Implementation

### Backend Models

#### 1. **Transaction Model** (`backend/models/Transaction.js`)
```javascript
{
  transactionId: String,        // Auto-generated unique ID
  type: 'income' | 'expense',   // Transaction type
  category: String,             // Main category
  subCategory: String,          // Sub-category
  amount: Number,               // Base amount
  gstAmount: Number,            // GST amount
  totalAmount: Number,          // Total with GST
  description: String,          // Transaction description
  date: Date,                   // Transaction date
  dueDate: Date,                // Due date for payments
  status: 'pending' | 'paid' | 'overdue' | 'cancelled',
  paymentMethod: String,        // Payment method
  referenceNumber: String,      // Payment reference
  relatedTo: String,            // Related to (maintenance, rent, etc.)
  flatNumber: String,           // Associated flat
  userId: ObjectId,             // Related user
  attachments: Array,           // File attachments
  isRecurring: Boolean,         // Recurring transaction
  recurringFrequency: String,   // Monthly/quarterly/yearly
  notes: String,                // Additional notes
  createdBy: ObjectId,          // Creator
  updatedBy: ObjectId           // Last updater
}
```

#### 2. **Budget Model** (`backend/models/Budget.js`)
```javascript
{
  year: Number,                 // Budget year
  month: Number,                // Budget month (optional)
  category: String,             // Budget category
  subCategory: String,          // Sub-category
  budgetedAmount: Number,       // Planned amount
  actualAmount: Number,         // Actual spent
  variance: Number,             // Budget variance
  variancePercentage: Number,   // Variance percentage
  status: 'draft' | 'approved' | 'active' | 'completed',
  approvedBy: ObjectId,         // Approver
  approvedAt: Date,             // Approval date
  isRecurring: Boolean,         // Recurring budget
  recurringFrequency: String,   // Frequency
  notes: String,                // Budget notes
  createdBy: ObjectId,          // Creator
  updatedBy: ObjectId           // Last updater
}
```

#### 3. **Invoice Model** (`backend/models/Invoice.js`)
```javascript
{
  invoiceNumber: String,        // Auto-generated invoice number
  flatNumber: String,           // Associated flat
  userId: ObjectId,             // Invoice recipient
  invoiceType: String,          // Invoice type
  month: Number,                // Invoice month
  year: Number,                 // Invoice year
  dueDate: Date,                // Payment due date
  items: Array,                 // Invoice items
  subtotal: Number,             // Subtotal amount
  gstTotal: Number,             // Total GST
  totalAmount: Number,          // Final amount
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
  paymentMethod: String,        // Payment method
  paymentDate: Date,            // Payment date
  referenceNumber: String,      // Payment reference
  isRecurring: Boolean,         // Recurring invoice
  recurringFrequency: String,   // Frequency
  notes: String,                // Invoice notes
  createdBy: ObjectId,          // Creator
  updatedBy: ObjectId           // Last updater
}
```

### API Endpoints

#### Finance Dashboard
- `GET /api/finance/dashboard` - Get financial overview and charts

#### Transactions
- `GET /api/finance/transactions` - Get transactions with filters
- `POST /api/finance/transactions` - Create new transaction
- `PUT /api/finance/transactions/:id` - Update transaction
- `DELETE /api/finance/transactions/:id` - Delete transaction

#### Budgets
- `GET /api/finance/budgets` - Get budgets with filters
- `POST /api/finance/budgets` - Create new budget
- `PUT /api/finance/budgets/:id` - Update budget
- `PATCH /api/finance/budgets/:id/approve` - Approve budget

#### Invoices
- `GET /api/finance/invoices` - Get invoices with filters
- `POST /api/finance/invoices` - Create new invoice
- `PUT /api/finance/invoices/:id` - Update invoice
- `PATCH /api/finance/invoices/:id/pay` - Mark invoice as paid

#### Reports
- `GET /api/finance/reports/financial` - Generate financial report
- `GET /api/finance/reports/dues` - Get outstanding dues report

## 🚀 Setup Instructions

### 1. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install multer
```

#### Frontend Dependencies
```bash
cd frontend
npm install @mui/x-date-pickers date-fns
```

### 2. Database Setup
The models will be automatically created when the application starts. No manual database setup required.

### 3. File Upload Configuration
The system automatically creates the following directories:
- `uploads/finance/` - For transaction attachments
- `uploads/profiles/` - For profile photos

### 4. Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🎯 Usage Guide

### For Administrators

#### 1. **Finance Dashboard**
- Navigate to "Finance Dashboard" in the admin menu
- View financial overview with charts and analytics
- Monitor income, expenses, and pending dues
- Analyze category-wise breakdown

#### 2. **Transaction Management**
- Navigate to "Transactions" in the admin menu
- Add new income/expense transactions
- Upload receipts and documents
- Track payment status and methods
- Filter and search transactions

#### 3. **Budget Management**
- Create annual/monthly budgets
- Set budget categories and amounts
- Track budget vs actual spending
- Approve budgets through workflow

#### 4. **Invoice Generation**
- Generate invoices for maintenance fees
- Create invoices for parking, events, clubhouse
- Include GST calculations
- Track payment status

### For Residents

#### 1. **View Invoices**
- Access invoices from the user dashboard
- View invoice details and payment status
- Download invoice PDFs

#### 2. **Make Payments**
- Pay invoices online
- Choose payment methods (UPI, cards, etc.)
- Receive payment confirmations

#### 3. **Payment History**
- View payment history
- Download payment receipts
- Track outstanding dues

## 📊 Financial Categories

### Income Categories
- **Maintenance**: Monthly maintenance fees
- **Rent**: Rental income from properties
- **Donation**: Voluntary contributions
- **Parking**: Parking fee collection
- **Event**: Event participation fees
- **Clubhouse**: Clubhouse booking fees
- **Guesthouse**: Guesthouse rental income
- **Other**: Miscellaneous income

### Expense Categories
- **Utility**: Electricity, water, internet bills
- **Repair**: Building and equipment repairs
- **Salary**: Staff salaries and wages
- **Security**: Security service payments
- **Housekeeping**: Cleaning and maintenance services
- **Admin**: Administrative expenses
- **Vendor**: Vendor payments
- **Other**: Miscellaneous expenses

## 🔒 Security Features

### Role-based Access
- **Admin**: Full access to all financial features
- **Resident**: Limited access to own invoices and payments
- **Treasurer**: Special access to financial reports

### Audit Trail
- All transactions are logged with creator/updater information
- File attachments are securely stored
- Payment confirmations are tracked

### Data Validation
- Amount validation and formatting
- Date range validation
- File type and size restrictions
- Required field validation

## 📈 Reporting Features

### Financial Reports
- **Monthly Reports**: Income vs expenses by month
- **Category Reports**: Breakdown by transaction type
- **Dues Reports**: Outstanding payment analysis
- **Budget Reports**: Budget vs actual comparison

### Export Options
- PDF export for reports
- Excel export for data analysis
- Invoice PDF generation
- Payment receipt generation

## 🎨 UI/UX Features

### Dashboard
- **Real-time Charts**: Interactive financial charts
- **Color-coded Status**: Visual status indicators
- **Responsive Design**: Mobile-friendly interface
- **Quick Actions**: Fast access to common tasks

### Forms
- **Smart Validation**: Real-time form validation
- **Auto-calculation**: Automatic GST and total calculation
- **File Upload**: Drag-and-drop file uploads
- **Date Pickers**: User-friendly date selection

### Tables
- **Sorting**: Sort by any column
- **Filtering**: Advanced filtering options
- **Pagination**: Efficient data loading
- **Search**: Global search functionality

## 🔧 Configuration

### Environment Variables
```env
# Backend (.env)
MONGO_URI=mongodb://localhost:27017/society_management
JWT_SECRET=your-secret-key
PORT=5002

# File Upload Settings
MAX_FILE_SIZE=5242880  # 5MB
UPLOAD_PATH=uploads/
```

### Customization Options
- **Currency**: Change from INR to other currencies
- **GST Rates**: Configure different GST rates
- **Payment Methods**: Add/remove payment options
- **Categories**: Customize income/expense categories
- **Budget Periods**: Set budget periods (monthly/quarterly/yearly)

## 🐛 Troubleshooting

### Common Issues

#### 1. **File Upload Errors**
```bash
# Check upload directory permissions
chmod 755 backend/uploads/
chmod 755 backend/uploads/finance/
```

#### 2. **Date Picker Issues**
```bash
# Install date picker dependencies
npm install @mui/x-date-pickers date-fns
```

#### 3. **Chart Display Issues**
```bash
# Install chart dependencies
npm install recharts
```

#### 4. **Database Connection**
```bash
# Check MongoDB connection
mongo --eval "db.adminCommand('ping')"
```

### Error Logs
- Check browser console for frontend errors
- Check server logs for backend errors
- Monitor MongoDB logs for database issues

## 📞 Support

### Documentation
- API documentation available at `/api/finance`
- Component documentation in code comments
- Database schema documentation

### Testing
- Test all CRUD operations
- Verify file upload functionality
- Check chart rendering
- Test mobile responsiveness

### Performance
- Optimize database queries
- Implement caching for charts
- Compress file uploads
- Paginate large datasets

---

**🎉 The Accounting & Finance Module is now ready for use!**

This comprehensive financial management system provides all the tools needed for effective society financial management, from basic transaction tracking to advanced reporting and analytics.
