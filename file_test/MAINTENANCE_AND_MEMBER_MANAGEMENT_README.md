# Society Management System - Maintenance & Member Management

This document describes the enhanced maintenance and member management features implemented for both admin and user roles.

## Overview

The system now provides comprehensive maintenance management with role-based access:
- **Admin**: Full maintenance management, member management, and payment tracking
- **Resident**: Personal maintenance viewing and payment processing

## User Maintenance Page (Residents)

### Features
- **Due Payments Overview**: Clear display of pending maintenance payments
- **Payment Methods**: Multiple payment options (Online Banking, Credit/Debit Card, UPI, Cash)
- **Payment History**: Track completed payments with timestamps
- **Mobile Responsive**: Optimized for both desktop and mobile devices

### Key Components
1. **Summary Cards**:
   - Total Due Amount
   - Pending Payments Count
   - Completed Payments Count
   - Days in Current Month

2. **Due Payments Section**:
   - List of unpaid maintenance records
   - Due dates and amounts
   - Status indicators (Unpaid, Overdue)
   - "Pay Now" buttons for each record

3. **Payment Dialog**:
   - Payment method selection
   - Payment processing simulation
   - Success/error handling
   - Real-time status updates

4. **Payment History**:
   - Recent payment records
   - Payment method used
   - Payment dates

### Payment Methods Available
- Online Banking
- Credit Card
- Debit Card
- UPI
- Cash

## Admin Maintenance Page

### Features
- **Complete Maintenance Management**: Create, edit, delete maintenance records
- **Member Management**: Add, edit, delete society members
- **Payment Tracking**: Monitor all payments across the society
- **Role-based Access**: Full administrative control

### Key Components
1. **Summary Dashboard**:
   - Total maintenance amount
   - Pending payments count
   - Completed payments count
   - Total members count

2. **Maintenance Records Management**:
   - Add new maintenance records
   - Edit existing records
   - Delete records
   - Update payment status
   - Filter by member and status

3. **Member Management**:
   - Add new members with detailed information
   - Edit member details
   - Delete members (with safety checks)
   - Search and filter members

4. **Advanced Features**:
   - Bulk operations
   - Export functionality
   - Payment status tracking
   - Member statistics

## Admin Member Management

### Comprehensive Member Profiles
Each member can have the following information:
- **Basic Info**: Home number, full name, role
- **Contact Details**: Email, phone number
- **Additional Info**: Occupation, family members, vehicle number
- **System Info**: Creation date, last update

### Features
1. **Member Dashboard**:
   - Total members count
   - Admin vs Resident breakdown
   - Total homes count
   - Member statistics

2. **Search and Filter**:
   - Search by name, home number, or username
   - Filter by role (Admin/Resident)
   - Real-time search results

3. **Member Operations**:
   - Add new members with complete profiles
   - Edit existing member information
   - Delete members (with admin protection)
   - Password management

4. **Mobile Responsive Design**:
   - List view for mobile devices
   - Table view for desktop
   - Touch-friendly interface

## Database Schema Updates

### Enhanced User Model
```javascript
{
  username: String,        // Home number (unique)
  password: String,        // Hashed password
  role: String,           // 'admin' or 'resident'
  homeNumber: String,     // Display home number
  name: String,           // Full name
  email: String,          // Email address
  phone: String,          // Phone number
  familyMembers: String,  // Family information
  vehicleNumber: String,  // Vehicle registration
  occupation: String,     // Professional details
  createdAt: Date,        // Account creation date
  updatedAt: Date         // Last update date
}
```

### Enhanced Maintenance Model
```javascript
{
  memberId: ObjectId,     // Reference to User
  month: String,          // Maintenance month
  amount: Number,         // Maintenance amount
  status: String,         // 'Paid', 'Unpaid', 'Overdue'
  dueDate: Date,          // Payment due date
  paymentMethod: String,  // Payment method used
  paymentDate: Date,      // Payment completion date
  createdAt: Date,        // Record creation date
  updatedAt: Date         // Last update date
}
```

## API Endpoints

### Maintenance Endpoints
- `GET /api/maintenance` - Get maintenance records (filtered by role)
- `POST /api/maintenance` - Create maintenance record
- `PUT /api/maintenance/:id` - Update maintenance record (Admin only)
- `DELETE /api/maintenance/:id` - Delete maintenance record (Admin only)

### User Management Endpoints
- `GET /api/auth/users` - Get all users (Admin only)
- `POST /api/auth/register` - Create new user (Admin only)
- `PUT /api/auth/users/:id` - Update user (Admin only)
- `DELETE /api/auth/users/:id` - Delete user (Admin only)
- `POST /api/auth/change-password` - Change password (Authenticated users)

## Security Features

### Role-Based Access Control
- **Admin**: Full access to all maintenance and member management features
- **Resident**: Limited to personal maintenance records and payments

### Data Protection
- Password hashing with bcrypt
- JWT token authentication
- Role-based API protection
- Input validation and sanitization

### Safety Measures
- Prevent deletion of last admin user
- Password update only when provided
- Secure payment processing simulation
- Error handling and user feedback

## Mobile Responsiveness

### Design Principles
- **Mobile-First**: Optimized for mobile devices
- **Responsive Grid**: Adapts to different screen sizes
- **Touch-Friendly**: Large buttons and touch targets
- **Progressive Enhancement**: Enhanced features on larger screens

### Mobile Features
- **Collapsible Navigation**: Space-efficient menu
- **List Views**: Better for mobile browsing
- **Floating Action Buttons**: Easy access to primary actions
- **Swipe Gestures**: Intuitive mobile interactions

## Usage Instructions

### For Residents
1. **Login** with home number and password
2. **View Dashboard** for personal overview
3. **Check Due Payments** in maintenance section
4. **Select Payment Method** and process payment
5. **View Payment History** for records

### For Admins
1. **Login** with admin credentials
2. **Access Admin Dashboard** for society overview
3. **Manage Members**:
   - Add new members with complete profiles
   - Edit existing member information
   - Search and filter members
4. **Manage Maintenance**:
   - Create maintenance records for members
   - Track payment status
   - Update payment information
5. **Monitor Society**:
   - View payment statistics
   - Track member activities
   - Generate reports

## Testing

### Test Scenarios
1. **Resident Payment Flow**:
   - Login as resident
   - View due payments
   - Select payment method
   - Process payment
   - Verify payment history

2. **Admin Management Flow**:
   - Login as admin
   - Add new member
   - Create maintenance record
   - Update payment status
   - Delete records

3. **Mobile Testing**:
   - Test on different screen sizes
   - Verify touch interactions
   - Check responsive behavior

### Test Data
```javascript
// Admin User
{
  username: 'H101',
  password: 'admin123',
  role: 'admin',
  homeNumber: '101'
}

// Resident User
{
  username: 'H102',
  password: 'resident123',
  role: 'resident',
  homeNumber: '102'
}
```

## Future Enhancements

### Planned Features
1. **Payment Gateway Integration**: Real payment processing
2. **Email Notifications**: Payment reminders and confirmations
3. **SMS Alerts**: Payment status updates
4. **Document Upload**: Receipt and document management
5. **Advanced Reporting**: Detailed analytics and reports
6. **Bulk Operations**: Mass member and maintenance management
7. **API Integration**: Third-party service integrations
8. **Mobile App**: Native mobile application

### Technical Improvements
1. **Real-time Updates**: WebSocket integration
2. **Offline Support**: Service worker implementation
3. **Data Export**: PDF and Excel export functionality
4. **Advanced Search**: Full-text search capabilities
5. **Audit Logging**: Complete activity tracking
6. **Backup System**: Automated data backup
7. **Performance Optimization**: Caching and optimization
8. **Security Enhancements**: Two-factor authentication

## Troubleshooting

### Common Issues
1. **Payment Processing**: Check network connection and API status
2. **Member Creation**: Verify unique home numbers and required fields
3. **Permission Errors**: Ensure proper role assignment
4. **Mobile Display**: Clear browser cache and check responsive design
5. **Data Synchronization**: Refresh page and check API connectivity

### Debug Commands
```bash
# Check user roles and permissions
node -e "
const mongoose = require('mongoose');
const User = require('./models/User');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await User.find({}, {password: 0});
  console.log('Users:', users);
  process.exit();
});
"

# Check maintenance records
node -e "
const mongoose = require('mongoose');
const Maintenance = require('./models/Maintenance');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const records = await Maintenance.find().populate('memberId');
  console.log('Maintenance Records:', records);
  process.exit();
});
"
```

## Support

For technical support or feature requests, please refer to the main project documentation or contact the development team.

---

**Note**: This system is designed for society management with role-based access control. Ensure proper security measures are in place for production deployment. 