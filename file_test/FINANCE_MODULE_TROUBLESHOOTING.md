# 🚨 Finance Module Troubleshooting Guide

## ❌ Error: 404 Not Found - `/api/finance/dashboard`

### 🔍 Root Cause
The 404 error occurs because the required dependencies for the Finance Module are not installed:

1. **Backend**: Missing `multer` package for file uploads
2. **Frontend**: Missing `recharts` package for charts and `@mui/x-date-pickers` for date pickers

### ✅ Solution

#### Step 1: Install Backend Dependencies
```bash
cd backend
npm install multer
```

#### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install recharts @mui/x-date-pickers date-fns
```

#### Step 3: Restart Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 🔧 Alternative: Use Setup Script
Run the automated setup script:
```bash
node setup_finance_module.js
```

## 🐛 Other Common Issues

### 1. **"recharts is not defined" Error**
**Solution**: Install recharts
```bash
cd frontend && npm install recharts
```

### 2. **Date Picker Not Working**
**Solution**: Install date picker dependencies
```bash
cd frontend && npm install @mui/x-date-pickers date-fns
```

### 3. **File Upload Errors**
**Solution**: Install multer
```bash
cd backend && npm install multer
```

### 4. **MongoDB Connection Issues**
**Solution**: Ensure MongoDB is running
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 5. **Port Already in Use**
**Solution**: Change port or kill existing process
```bash
# Kill process on port 5002
npx kill-port 5002

# Or change port in .env file
PORT=5003
```

## 🧪 Testing the Finance Module

### 1. **Login as Admin**
- Username: `admin`
- Password: `admin123`

### 2. **Navigate to Finance Dashboard**
- Click on "Finance Dashboard" in the admin menu
- Should show financial overview with charts

### 3. **Test Transactions**
- Click on "Transactions" in the admin menu
- Try adding a new transaction
- Test file upload functionality

### 4. **Verify API Endpoints**
Test these endpoints in your browser or Postman:
- `http://localhost:5002/api/finance/dashboard`
- `http://localhost:5002/api/finance/transactions`

## 📋 Checklist

- [ ] Backend dependencies installed (`multer`)
- [ ] Frontend dependencies installed (`recharts`, `@mui/x-date-pickers`, `date-fns`)
- [ ] Backend server running on port 5002
- [ ] Frontend server running on port 5173
- [ ] MongoDB connected successfully
- [ ] Admin user logged in
- [ ] Finance Dashboard loads without errors
- [ ] Charts display correctly
- [ ] Transactions page works

## 🆘 Still Having Issues?

### Check Server Logs
```bash
# Backend logs
cd backend && npm start

# Frontend logs (browser console)
F12 → Console tab
```

### Verify File Structure
```
backend/
├── models/
│   ├── Transaction.js ✅
│   ├── Budget.js ✅
│   └── Invoice.js ✅
├── routes/
│   └── finance.js ✅
└── server.js ✅

frontend/
├── src/
│   └── pages/
│       ├── FinanceDashboard.jsx ✅
│       └── Transactions.jsx ✅
└── package.json ✅
```

### Test API Directly
```bash
curl http://localhost:5002/api/finance/dashboard
```

## 📞 Support

If you're still experiencing issues:
1. Check the browser console for detailed error messages
2. Verify all dependencies are installed correctly
3. Ensure both servers are running
4. Check MongoDB connection status
5. Review the server logs for backend errors

---

**🎯 Quick Fix**: Run `node setup_finance_module.js` to automatically install all dependencies!
