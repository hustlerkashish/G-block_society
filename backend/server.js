require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const User = require('./models/User');
const maintenanceRoutes = require("./routes/maintenance");
const complaintRoutes = require('./routes/complaints');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');
const profileRoutes = require('./routes/profile');
const financeRoutes = require('./routes/finance');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads');
const profilesDir = path.join(uploadsDir, 'profiles');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir);
}

// Set JWT_SECRET if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-secret-key-change-in-production';
  console.log('⚠️  JWT_SECRET not found in environment, using default key');
}

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/society_management', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(async () => {
    console.log('✅ MongoDB connected successfully');
    
    // Create default admin user if no admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new User({
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        homeNumber: 'A001',
        name: 'System Administrator',
        email: 'admin@society.com',
        phone: '9876543210'
      });
      await admin.save();
      console.log('✅ Default admin user created:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   Role: admin');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create a test resident user if none exists
    const residentExists = await User.findOne({ role: 'resident' });
    if (!residentExists) {
      const resident = new User({
        username: 'H101',
        password: 'resident123',
        role: 'resident',
        homeNumber: '101',
        name: 'Test Resident',
        email: 'resident@society.com',
        phone: '9876543211'
      });
      await resident.save();
      console.log('✅ Default resident user created:');
      console.log('   Username: H101');
      console.log('   Password: resident123');
      console.log('   Role: resident');
    } else {
      console.log('ℹ️  Resident users already exist');
    }

    // List all users
    const users = await User.find({}, { password: 0 });
    console.log(`📋 Total users in database: ${users.length}`);
    users.forEach(user => {
      console.log(`   - ${user.username} (${user.role}) - Home: ${user.homeNumber}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('💡 Make sure MongoDB is running on your system');
    }
  });

app.use("/api/maintenance", maintenanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/finance', financeRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}/api`);
  console.log('\n🔑 Default Login Credentials:');
  console.log('   Admin:    username=admin, password=admin123');
  console.log('   Resident: username=H101, password=resident123');
}); 