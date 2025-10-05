require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/society_management';
    await mongoose.connect(mongoUri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    
    console.log('✅ Database connected successfully');
    
    // Test user authentication
    console.log('\n🔍 Testing user authentication...');
    
    const testUsers = [
      { username: 'admin', password: 'admin123' },
      { username: 'H101', password: 'resident123' }
    ];
    
    for (const testUser of testUsers) {
      const user = await User.findOne({ username: testUser.username });
      
      if (user) {
        const isMatch = await user.comparePassword(testUser.password);
        console.log(`✅ User ${testUser.username}: ${isMatch ? 'Password OK' : 'Password FAILED'}`);
      } else {
        console.log(`❌ User ${testUser.username}: NOT FOUND`);
      }
    }
    
    // List all users
    const users = await User.find({}, { password: 0 });
    console.log(`\n📋 Total users in database: ${users.length}`);
    
    if (users.length > 0) {
      console.log('Users found:');
      users.forEach(user => {
        console.log(`  - ${user.username} (${user.role}) - Home: ${user.homeNumber}`);
      });
    } else {
      console.log('❌ No users found in database');
      console.log('💡 Run "node createTestUser.js" to create test users');
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure MongoDB is running on your system');
      console.error('   Windows: net start MongoDB');
      console.error('   macOS/Linux: sudo systemctl start mongod');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database disconnected');
  }
}

testConnection(); 