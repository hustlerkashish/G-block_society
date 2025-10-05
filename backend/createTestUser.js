require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createTestUser() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/society_management';
    await mongoose.connect(mongoUri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    
    console.log('✅ MongoDB connected successfully');

    // Create test users
    const testUsers = [
      {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        homeNumber: 'A001',
        name: 'Admin User',
        email: 'admin@society.com',
        phone: '9876543210'
      },
      {
        username: 'H101',
        password: 'resident123',
        role: 'resident',
        homeNumber: '101',
        name: 'Resident 101',
        email: 'resident101@society.com',
        phone: '9876543211'
      },
      {
        username: 'H102',
        password: 'resident123',
        role: 'resident',
        homeNumber: '102',
        name: 'Resident 102',
        email: 'resident102@society.com',
        phone: '9876543212'
      },
      {
        username: 'H103',
        password: 'resident123',
        role: 'resident',
        homeNumber: '103',
        name: 'Resident 103',
        email: 'resident103@society.com',
        phone: '9876543213'
      },
      {
        username: 'Admin',
        password: 'admin123',
        role: 'admin',
        homeNumber: 'A001',
        name: 'Admin User',
        email: 'admin@society.com',
        phone: '9876543210'
      },
      {
        username: 'H201',
        password: 'resident123',
        role: 'resident',
        homeNumber: '201',
        name: 'Resident 201',
        email: 'resident201@society.com',
        phone: '9876543214'
      }
    ];

    console.log('\n🔄 Creating test users...');

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ username: userData.username });
      
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created user: ${userData.username} (${userData.role}) - Home: ${userData.homeNumber}`);
      } else {
        console.log(`ℹ️  User already exists: ${userData.username} (${userData.role}) - Home: ${userData.homeNumber}`);
      }
    }

    // List all users
    const users = await User.find({}, { password: 0 });
    console.log('\n📋 All users in database:');
    console.log('┌─────────────────┬──────────┬─────────────┬─────────────────┐');
    console.log('│ Username        │ Role     │ Home Number │ Name            │');
    console.log('├─────────────────┼──────────┼─────────────┼─────────────────┤');
    
    users.forEach(user => {
      const username = user.username.padEnd(15);
      const role = user.role.padEnd(8);
      const homeNumber = user.homeNumber.padEnd(11);
      const name = (user.name || 'N/A').padEnd(15);
      console.log(`│ ${username} │ ${role} │ ${homeNumber} │ ${name} │`);
    });
    
    console.log('└─────────────────┴──────────┴─────────────┴─────────────────┘');

    console.log('\n🔑 Login Credentials:');
    console.log('┌─────────────────┬──────────────┬──────────┐');
    console.log('│ Username        │ Password     │ Role     │');
    console.log('├─────────────────┼──────────────┼──────────┤');
    console.log('│ admin           │ admin123     │ admin    │');
    console.log('│ H101            │ resident123  │ resident │');
    console.log('│ H102            │ resident123  │ resident │');
    console.log('│ H103            │ resident123  │ resident │');
    console.log('│ H201            │ resident123  │ resident │');
    console.log('└─────────────────┴──────────────┴──────────┘');

    console.log('\n💡 Instructions:');
    console.log('1. Start the backend server: npm start');
    console.log('2. Start the frontend: npm run dev');
    console.log('3. Use the credentials above to login');
    console.log('4. Admin users can access all features');
    console.log('5. Resident users can book events and manage their profile');

  } catch (error) {
    console.error('❌ Error creating test users:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure MongoDB is running on your system');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 MongoDB disconnected');
  }
}

createTestUser(); 