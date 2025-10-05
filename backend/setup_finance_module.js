#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏦 Setting up Finance Module Dependencies...\n');

// Check if we're in the right directory
if (!fs.existsSync('backend') || !fs.existsSync('frontend')) {
  console.error('❌ Error: Please run this script from the project root directory');
  process.exit(1);
}

try {
  // Install backend dependencies
  console.log('📦 Installing backend dependencies...');
  execSync('cd backend && npm install multer', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed successfully\n');

  // Install frontend dependencies
  console.log('📦 Installing frontend dependencies...');
  execSync('cd frontend && npm install recharts @mui/x-date-pickers date-fns', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed successfully\n');

  console.log('🎉 Finance Module setup completed successfully!');
  console.log('\n📋 Next Steps:');
  console.log('1. Start the backend server:');
  console.log('   cd backend && npm start');
  console.log('\n2. Start the frontend development server:');
  console.log('   cd frontend && npm run dev');
  console.log('\n3. Login as admin (admin/admin123) and navigate to "Finance Dashboard"');
  console.log('\n4. Test the Transactions page to add financial data');

} catch (error) {
  console.error('❌ Error during setup:', error.message);
  console.log('\n💡 Manual Setup Instructions:');
  console.log('1. Install backend dependencies:');
  console.log('   cd backend && npm install multer');
  console.log('\n2. Install frontend dependencies:');
  console.log('   cd frontend && npm install recharts @mui/x-date-pickers date-fns');
  console.log('\n3. Start the application as shown above');
}
