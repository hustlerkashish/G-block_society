# Society Management System - Setup Guide

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)
- Git

### Step 1: Clone and Setup
```bash
# Navigate to your project directory
cd Society_mangement

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Database Setup
Make sure MongoDB is running on your system:

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**macOS/Linux:**
```bash
# Start MongoDB
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### Step 3: Environment Configuration
Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/society_management
JWT_SECRET=your-secret-key-change-in-production
PORT=5002
```

### Step 4: Create Test Users
```bash
cd backend
node createTestUser.js
```

This will create:
- **Admin User**: username=admin, password=admin123
- **Resident Users**: username=H101, password=resident123

### Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 6: Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5002

## 🔑 Default Login Credentials

### Admin Access
- **Username**: admin
- **Password**: admin123
- **Features**: Full access to all modules

### Resident Access
- **Username**: H101
- **Password**: resident123
- **Features**: Limited access to resident features

## 🛠️ Troubleshooting

### Issue: "Cannot connect to server"
**Solution:**
1. Make sure MongoDB is running
2. Check if backend server is started on port 5002
3. Verify the MONGO_URI in your .env file

### Issue: "Invalid credentials"
**Solution:**
1. Run the test user creation script: `node createTestUser.js`
2. Use the exact credentials shown in the console output
3. Check if the user exists in the database

### Issue: "JWT_SECRET not found"
**Solution:**
1. Add JWT_SECRET to your .env file
2. Restart the backend server

### Issue: Database connection failed
**Solution:**
1. Ensure MongoDB is installed and running
2. Check if the database name is correct
3. Verify network connectivity

## 📋 System Features

### Admin Features
- ✅ Dashboard with analytics
- ✅ Member management
- ✅ Event management with booking analytics
- ✅ Maintenance management
- ✅ Complaint handling
- ✅ Financial reporting

### Resident Features
- ✅ Personal dashboard
- ✅ Event booking
- ✅ Maintenance requests
- ✅ Complaint submission
- ✅ Profile management

## 🔧 Development Commands

### Backend Commands
```bash
cd backend

# Start development server
npm start

# Create test users
node createTestUser.js

# Create test events
node createTestEvents.js

# Check database connection
node testConnection.js
```

### Frontend Commands
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Database Schema

### Users Collection
```javascript
{
  username: String,        // Home number (e.g., "H101")
  password: String,        // Hashed password
  role: String,           // "admin" or "resident"
  homeNumber: String,     // House number
  name: String,           // Full name
  email: String,          // Email address
  phone: String,          // Phone number
  familyMembers: String,  // Number of family members
  vehicleNumber: String,  // Vehicle registration
  occupation: String,     // Occupation
  createdAt: Date,
  updatedAt: Date
}
```

### Events Collection
```javascript
{
  title: String,          // Event title
  date: Date,            // Event date
  time: String,          // Event time
  location: String,      // Event location
  capacity: Number,      // Maximum attendees
  attendees: Number,     // Current attendees
  status: String,        // "upcoming", "ongoing", "completed"
  isPaid: Boolean,       // Whether event requires payment
  price: Number,         // Price per person
  description: String,   // Event description
  createdBy: ObjectId,   // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection
```javascript
{
  userId: ObjectId,      // Reference to User
  eventId: ObjectId,     // Reference to Event
  attendees: Number,     // Number of people
  status: String,        // "pending", "confirmed", "cancelled"
  specialRequirements: String,
  amount: Number,        // Total amount paid
  paymentStatus: String, // "pending", "completed", "failed"
  paymentMethod: String, // Payment method used
  bookedAt: Date,
  updatedAt: Date
}
```

## 🚨 Security Notes

1. **Change Default Passwords**: Update default passwords in production
2. **JWT Secret**: Use a strong, unique JWT_SECRET in production
3. **Environment Variables**: Never commit .env files to version control
4. **Database Security**: Enable authentication for MongoDB in production
5. **HTTPS**: Use HTTPS in production environments

## 📞 Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure all services are running
4. Check the troubleshooting section above

## 🎯 Next Steps

After successful setup:

1. **Test Login**: Try logging in with both admin and resident accounts
2. **Create Events**: Use admin account to create test events
3. **Book Events**: Use resident account to book events
4. **Check Analytics**: View booking analytics in admin dashboard
5. **Customize**: Modify the system according to your requirements

---

**Happy Coding! 🎉**
