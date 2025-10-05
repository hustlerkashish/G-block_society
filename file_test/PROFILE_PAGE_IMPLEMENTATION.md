# User Profile Page Implementation

## 🎯 Overview

A comprehensive user profile page has been implemented with the following features:
- **Profile Photo Upload**: Users can upload and update their profile pictures
- **Personal Information Management**: Edit name, email, and phone number
- **Family Member Management**: Add, view, and remove family members
- **Password Change**: Secure password update functionality
- **Logout Option**: Easy logout from the profile page
- **Mobile Responsive**: Optimized for both desktop and mobile devices

## 📁 Files Created/Modified

### Frontend Files
1. **`frontend/src/pages/UserProfile.jsx`** - Main profile page component
2. **`frontend/src/App.jsx`** - Added profile route and navigation

### Backend Files
1. **`backend/routes/profile.js`** - Profile management API routes
2. **`backend/models/FamilyMember.js`** - Family member data model
3. **`backend/models/User.js`** - Updated with profilePhoto field
4. **`backend/server.js`** - Added profile routes and static file serving

## 🚀 Features Implemented

### 1. Profile Photo Management
- **Upload Profile Photo**: Click camera icon on avatar to upload new photo
- **Photo Preview**: See selected photo before uploading
- **File Validation**: Only image files allowed (5MB limit)
- **Automatic Storage**: Photos stored in `uploads/profiles/` directory

### 2. Personal Information
- **Editable Fields**: Name, email, phone number
- **Read-only Fields**: House number (cannot be changed)
- **Edit Mode**: Toggle between view and edit modes
- **Validation**: Form validation and error handling

### 3. Family Member Management
- **Add Family Members**: Name, age, relationship, optional phone
- **Relationship Types**: Spouse, Child, Parent, Sibling, Other Family
- **View Family List**: See all family members with details
- **Remove Members**: Delete family members with confirmation

### 4. Password Change
- **Current Password Verification**: Must enter current password
- **New Password**: Enter and confirm new password
- **Password Visibility**: Toggle password visibility
- **Security**: Admin can change any user's password

### 5. User Interface
- **Responsive Design**: Works on desktop and mobile
- **Material-UI Components**: Modern, consistent UI
- **Loading States**: Loading indicators for all operations
- **Success/Error Messages**: Clear feedback for all actions

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install multer
```

### 2. Create Upload Directories
The server will automatically create the required directories:
- `backend/uploads/` - Main uploads directory
- `backend/uploads/profiles/` - Profile photos directory

### 3. Start the Application
```bash
# Start backend
cd backend
npm start

# Start frontend (in new terminal)
cd frontend
npm run dev
```

## 📱 Navigation

### For Residents
1. Login as resident (H101 / resident123)
2. Click "Profile" in the left navigation
3. Access all profile features

### For Admins
1. Login as admin (admin / admin123)
2. Profile page is available but primarily designed for residents
3. Admins can manage any user's profile

## 🔌 API Endpoints

### Profile Management
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile/:userId` - Update profile information
- `PUT /api/profile/:userId/photo` - Upload profile photo
- `PUT /api/profile/:userId/password` - Change password

### Family Management
- `GET /api/profile/family/:userId` - Get family members
- `POST /api/profile/family/:userId` - Add family member
- `DELETE /api/profile/family/:userId/:memberId` - Remove family member

## 🎨 UI Components

### Profile Header
- User avatar with photo upload button
- User name and house number
- Role indicator (Resident/Administrator)
- Logout and Change Password buttons

### Personal Information Card
- Editable form fields
- Edit/Save toggle button
- Cancel option to revert changes

### Family Members Card
- List of family members
- Add new member button
- Delete member option for each entry

### Dialogs
- **Photo Upload Dialog**: File selection and preview
- **Password Change Dialog**: Current and new password fields
- **Add Family Member Dialog**: Complete family member form

## 🔒 Security Features

### Authentication
- All routes require valid JWT token
- Users can only access their own profile (unless admin)
- Admin can access any user's profile

### File Upload Security
- File type validation (images only)
- File size limits (5MB)
- Secure file naming with timestamps
- Static file serving with proper paths

### Password Security
- Current password verification required
- Password hashing using bcrypt
- Admin bypass for password changes

## 📊 Data Models

### User Model (Updated)
```javascript
{
  username: String,        // Home number
  password: String,        // Hashed password
  role: String,           // 'admin' or 'resident'
  homeNumber: String,     // House number
  name: String,           // Full name
  email: String,          // Email address
  phone: String,          // Phone number
  profilePhoto: String,   // Photo file path
  // ... other fields
}
```

### Family Member Model
```javascript
{
  userId: ObjectId,       // Reference to User
  name: String,           // Family member name
  age: Number,            // Age (0-120)
  phone: String,          // Optional phone
  relationship: String,   // spouse/child/parent/sibling/family
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Test Scenarios
1. **Profile Photo Upload**
   - Select image file
   - Preview before upload
   - Verify upload success

2. **Profile Information Update**
   - Enter edit mode
   - Modify name, email, phone
   - Save changes
   - Verify persistence

3. **Family Member Management**
   - Add new family member
   - View in family list
   - Remove family member
   - Verify list updates

4. **Password Change**
   - Enter current password
   - Enter new password
   - Confirm new password
   - Verify password change

5. **Logout Functionality**
   - Click logout button
   - Confirm logout
   - Verify redirect to login

## 🐛 Troubleshooting

### Common Issues

#### 1. Photo Upload Fails
**Solution**: 
- Check if `multer` package is installed
- Verify uploads directory exists
- Check file size (max 5MB)
- Ensure file is an image

#### 2. Profile Not Loading
**Solution**:
- Check if user is authenticated
- Verify API endpoints are accessible
- Check browser console for errors

#### 3. Family Members Not Saving
**Solution**:
- Verify FamilyMember model is created
- Check database connection
- Ensure all required fields are provided

#### 4. Password Change Fails
**Solution**:
- Verify current password is correct
- Check password confirmation matches
- Ensure new password meets requirements

## 🚀 Future Enhancements

### Potential Improvements
1. **Profile Photo Cropping**: Add image cropping functionality
2. **Family Member Photos**: Allow photos for family members
3. **Profile Verification**: Add profile verification system
4. **Social Features**: Add family member connections
5. **Profile Templates**: Predefined profile templates
6. **Export Profile**: Export profile data as PDF
7. **Profile Analytics**: Track profile completion percentage

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Ensure backend server is running
4. Check database connection
5. Review API endpoint responses

---

**The profile page is now fully functional and ready for use!**
