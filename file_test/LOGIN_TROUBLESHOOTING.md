# Login Troubleshooting Guide

## 🚨 Issue: Resident Dashboard Not Loading

**Problem**: When logging in as a resident, the dashboard doesn't load and redirects back to login screen.

## 🔍 Step-by-Step Troubleshooting

### Step 1: Check Backend Server
```bash
# Make sure backend is running
cd backend
npm start
```

**Expected Output:**
```
🚀 Server running on port 5002
🌐 API available at http://localhost:5002/api
✅ MongoDB connected successfully
✅ Default admin user created:
   Username: admin
   Password: admin123
   Role: admin
✅ Default resident user created:
   Username: H101
   Password: resident123
   Role: resident
```

### Step 2: Test Database Connection
```bash
cd backend
node testConnection.js
```

**Expected Output:**
```
🔍 Testing database connection...
✅ Database connected successfully
🔍 Testing user authentication...
✅ User admin: Password OK
✅ User H101: Password OK
📋 Total users in database: 2
Users found:
  - admin (admin) - Home: A001
  - H101 (resident) - Home: 101
```

### Step 3: Check Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try to login as resident (username: H101, password: resident123)
4. Look for debug messages

**Expected Debug Output:**
```
🔐 Attempting login for user: H101
✅ Login successful
🔍 Debug Login Response:
Response data: {
  token: "...",
  _id: "...",
  role: "resident",
  username: "H101",
  homeNumber: "101",
  name: "Test Resident",
  email: "resident@society.com",
  phone: "9876543211"
}
💾 User data stored in localStorage
🔄 Redirecting to user dashboard
🏠 UserDashboard - Component mounted
✅ UserDashboard - User data is valid, fetching user data...
```

### Step 4: Check Network Tab
1. In browser developer tools, go to Network tab
2. Try to login
3. Look for API calls to `/api/auth/login`
4. Check the response status and data

**Expected Network Call:**
- **URL**: `POST http://localhost:5002/api/auth/login`
- **Status**: 200 OK
- **Response**: JSON with user data including `_id`

## 🛠️ Common Issues and Solutions

### Issue 1: "Cannot connect to server"
**Symptoms**: Login fails with connection error
**Solution**:
1. Make sure backend server is running on port 5002
2. Check if MongoDB is running
3. Verify no firewall blocking the connection

### Issue 2: "Invalid credentials"
**Symptoms**: Login fails with 401 error
**Solution**:
1. Run `node createTestUser.js` to create test users
2. Use exact credentials: username=H101, password=resident123
3. Check if user exists in database

### Issue 3: "User data is incomplete"
**Symptoms**: Login succeeds but dashboard shows error
**Solution**:
1. Check if backend login response includes `_id` field
2. Verify user object has all required fields
3. Clear browser localStorage and try again

### Issue 4: "UserDashboard - User validation failed"
**Symptoms**: Dashboard shows validation error
**Solution**:
1. Check browser console for specific validation issues
2. Verify user object structure
3. Clear localStorage and re-login

## 🔧 Manual Testing Steps

### Test 1: Direct API Call
```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"H101","password":"resident123"}'
```

**Expected Response:**
```json
{
  "token": "...",
  "_id": "...",
  "role": "resident",
  "username": "H101",
  "homeNumber": "101",
  "name": "Test Resident",
  "email": "resident@society.com",
  "phone": "9876543211"
}
```

### Test 2: Check LocalStorage
1. Open browser developer tools
2. Go to Application tab
3. Check Local Storage for:
   - `token` (should exist)
   - `user` (should contain user data with `_id`)

### Test 3: Manual Navigation
1. After login, manually navigate to `http://localhost:5173/user-dashboard`
2. Check if dashboard loads
3. Look for any console errors

## 🐛 Debug Information

### Backend Debug
Add this to `backend/routes/auth.js` login route:
```javascript
console.log('Login attempt for:', username);
console.log('User found:', user);
console.log('Password match:', isMatch);
console.log('Response data:', {
  token: token,
  _id: user._id,
  role: user.role,
  username: user.username,
  homeNumber: user.homeNumber
});
```

### Frontend Debug
The debug utilities are already added. Check browser console for:
- Login response data
- User validation results
- API call results
- Component mounting logs

## 📋 Checklist

- [ ] Backend server is running on port 5002
- [ ] MongoDB is running and connected
- [ ] Test users exist in database
- [ ] Login API returns user data with `_id`
- [ ] Frontend receives complete user data
- [ ] User validation passes
- [ ] Dashboard component mounts successfully
- [ ] API calls for user data succeed

## 🚀 Quick Fix Commands

```bash
# 1. Start MongoDB (Windows)
net start MongoDB

# 2. Create test users
cd backend
node createTestUser.js

# 3. Start backend
npm start

# 4. Start frontend (new terminal)
cd frontend
npm run dev

# 5. Test login
# Go to http://localhost:5173
# Login with: H101 / resident123
```

## 📞 If Still Not Working

1. **Check all console logs** (both backend and frontend)
2. **Verify network requests** in browser dev tools
3. **Test with admin login** first to verify system works
4. **Clear browser cache and localStorage**
5. **Restart both backend and frontend servers**

---

**Need more help?** Check the console logs and share the specific error messages you see.
