# Quick Fix for Resident Login Issue

## 🚨 Problem
Resident login redirects back to login screen instead of showing dashboard.

## ✅ Solution

### Step 1: Restart Backend
```bash
cd backend
npm start
```

### Step 2: Create Test Users
```bash
cd backend
node createTestUser.js
```

### Step 3: Test Login
1. Go to http://localhost:5173
2. Login with: **H101** / **resident123**
3. Check browser console (F12) for errors

### Step 4: If Still Not Working
1. Clear browser localStorage:
   - F12 → Application → Local Storage → Clear
2. Restart frontend:
   ```bash
   cd frontend
   npm run dev
   ```
3. Try login again

## 🔍 Debug Steps
1. Open browser console (F12)
2. Try to login
3. Look for error messages
4. Check if user data has `_id` field

## 📞 Common Issues
- **Backend not running**: Start with `npm start`
- **No users in database**: Run `node createTestUser.js`
- **Missing user ID**: Check login response includes `_id`
- **Network error**: Verify backend on port 5002
