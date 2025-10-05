# Society Management System - Role-Based Authentication

This document describes the implementation of role-based authentication in the Society Management System.

## Overview

The system now supports two distinct user roles:
- **Admin**: Society administrators with full access to all features
- **Resident**: Society residents with limited access to relevant features

## User Roles and Permissions

### Admin Role
- **Dashboard**: Admin-specific dashboard with society overview
- **Member Management**: Create, view, and manage all residents
- **Maintenance & Billing**: Full access to all maintenance records
- **Accounting & Finance**: Financial management features
- **Complaint Management**: Handle and resolve all complaints
- **Event Management**: Organize and manage society events
- **Security Management**: Visitor and security management
- **Notice Board**: Post and manage society notices
- **Document Management**: Manage society documents
- **Reports & Analytics**: Access to all reports and analytics
- **User Management**: Create new users and assign passwords

### Resident Role
- **Dashboard**: Resident-specific dashboard with personal information
- **Maintenance & Billing**: View and pay personal maintenance dues
- **Complaint Management**: Raise and track personal complaints
- **Event Management**: Book facilities and view events
- **Notice Board**: View society notices
- **Document Management**: Access personal documents
- **Change Password**: Update personal password

## Authentication Flow

1. **Login**: Users enter their home number and password
2. **Role Detection**: System identifies user role from database
3. **Token Generation**: JWT token is created with user role information
4. **Role-Based Redirect**: Users are redirected to appropriate dashboard
5. **Session Management**: Token is stored in localStorage for persistent sessions

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create new user (Admin only)
- `POST /api/auth/change-password` - Change password (Authenticated users)
- `GET /api/auth/users` - Get all users (Admin only)

### Protected Endpoints
All maintenance endpoints now require authentication:
- `POST /api/maintenance` - Create maintenance record
- `GET /api/maintenance` - Get maintenance records (filtered by role)
- `PUT /api/maintenance/:id` - Update maintenance (Admin only)
- `DELETE /api/maintenance/:id` - Delete maintenance (Admin only)

## Frontend Implementation

### Role-Based Routing
- Admin users are redirected to `/admin-dashboard`
- Resident users are redirected to `/user-dashboard`
- Navigation menu adapts based on user role
- Protected routes are conditionally rendered

### Components
- `AdminDashboard.jsx` - Admin-specific dashboard
- `UserDashboard.jsx` - Resident-specific dashboard
- `Login.jsx` - Updated with role-based redirection
- `App.jsx` - Role-based navigation and routing

### Authentication Utilities
- `api.js` - Centralized API client with token management
- Automatic token injection in requests
- Automatic logout on authentication errors

## Database Schema

### User Model
```javascript
{
  username: String,        // Home number (unique)
  password: String,        // Hashed password
  role: String,           // 'admin' or 'resident'
  homeNumber: String      // Home number
}
```

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: Bcrypt password hashing
3. **Role-Based Access Control**: Middleware protection for routes
4. **Token Expiration**: 1-hour token expiration
5. **Automatic Logout**: Session cleanup on auth errors

## Testing

### Default Users

#### Admin User
- **Username**: H101
- **Password**: admin123
- **Role**: admin
- **Home Number**: 101

#### Resident User
- **Username**: H102
- **Password**: resident123
- **Role**: resident
- **Home Number**: 102

### Creating Test Users

Run the test user creation script:
```bash
cd backend
node createTestUser.js
```

## Setup Instructions

1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Set up environment variables (MONGO_URI, JWT_SECRET)
   npm start
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Database Setup**:
   - Ensure MongoDB is running
   - Admin user is automatically created on server startup
   - Run `node createTestUser.js` to create test resident user

## Usage

1. **Admin Login**:
   - Use H101/admin123 to login as admin
   - Access full admin dashboard with all features
   - Can create new users and manage society

2. **Resident Login**:
   - Use H102/resident123 to login as resident
   - Access resident dashboard with personal features
   - Limited to personal maintenance and complaints

## Middleware

### Authentication Middleware
- `authenticateToken`: Verifies JWT token and loads user
- `requireAdmin`: Ensures user has admin role
- `requireResident`: Ensures user has resident role

### Usage
```javascript
// Protect admin-only routes
router.get('/admin-only', authenticateToken, requireAdmin, handler);

// Protect resident-only routes
router.get('/resident-only', authenticateToken, requireResident, handler);

// Protect authenticated routes
router.get('/protected', authenticateToken, handler);
```

## Future Enhancements

1. **Role Hierarchy**: Support for multiple admin levels
2. **Permission System**: Granular permissions per feature
3. **Audit Logging**: Track user actions and changes
4. **Session Management**: Multiple device support
5. **Password Policies**: Enforce strong password requirements
6. **Two-Factor Authentication**: Additional security layer

## Troubleshooting

### Common Issues

1. **Token Expired**: User will be automatically logged out
2. **Invalid Role**: Check user role in database
3. **CORS Issues**: Ensure backend CORS is properly configured
4. **Database Connection**: Verify MongoDB connection string

### Debug Commands

```bash
# Check user roles in database
node -e "
const mongoose = require('mongoose');
const User = require('./models/User');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await User.find({}, {password: 0});
  console.log(users);
  process.exit();
});
"
```

## Security Considerations

1. **Environment Variables**: Keep JWT_SECRET secure
2. **Password Storage**: Passwords are hashed using bcrypt
3. **Token Security**: Tokens expire after 1 hour
4. **Input Validation**: Validate all user inputs
5. **HTTPS**: Use HTTPS in production
6. **Rate Limiting**: Implement rate limiting for auth endpoints 