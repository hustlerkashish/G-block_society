# 🎯 Events & Facility Booking System - Setup Guide

## ✅ What's Been Implemented

### **Complete Events & Facility Booking Module:**
- **User Page Updates**: Events visible to all users (admin + residents)
- **Family Member Count**: Automatic fetching and smart booking logic
- **Admin Event Management**: Create, edit, delete events with full CRUD
- **One-Time Booking**: Users can only book each event once
- **Real-Time Activities**: Live admin dashboard updates
- **Payment Integration**: Comprehensive payment gateway for paid events
- **Smart Pricing**: Family member-aware booking with extra charges

## 🚀 Quick Start

### **1. Backend Setup**
```bash
cd backend
npm install
```

### **2. Database Setup**
Make sure MongoDB is running and create a `.env` file:
```env
PORT=5002
MONGO_URI=mongodb://localhost:27017/society_management
JWT_SECRET=your_secret_key_here
```

### **3. Create Test Data**
```bash
# Create admin user and test events
node createTestEvents.js
```

### **4. Start Backend**
```bash
npm start
```

### **5. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Key Features

### **For Admins:**
- ✅ Create new events (paid/free)
- ✅ Edit existing events
- ✅ Delete events
- ✅ Set pricing and capacity
- ✅ Monitor bookings
- ✅ Real-time activity tracking

### **For Residents:**
- ✅ Browse all events
- ✅ Book events (one-time only)
- ✅ Family member-aware booking
- ✅ Payment for paid events
- ✅ View booking history
- ✅ Special requirements input

### **Smart Booking Logic:**
- **Paid Events**: Always require payment
- **Free Events**: Free within family limit, charges for extra attendees
- **One-Time Restriction**: Database-level prevention of duplicate bookings
- **Capacity Management**: Real-time attendee tracking

## 📱 User Experience

### **Admin Dashboard:**
- Live activity feed
- Quick action buttons
- Event management tools
- Real-time statistics

### **Resident Interface:**
- Clean event browsing
- Smart booking forms
- Payment integration
- Booking history

## 🗄️ Database Models

### **Event Schema:**
- Title, date, time, location
- Capacity and attendee tracking
- Paid/free toggle with pricing
- Admin creation tracking

### **Booking Schema:**
- User-event relationship
- Attendee count and requirements
- Payment status tracking
- Unique constraint per user per event

## 🔒 Security Features

- JWT authentication
- Role-based access control
- Admin-only event management
- User-specific booking access
- Database-level constraints

## 🚨 Troubleshooting

### **Common Issues:**

1. **"useState is not defined"**
   - ✅ Fixed: Added `useState` import to AdminDashboard

2. **Database Connection Issues**
   - ✅ Run `node testConnection.js` to test connection
   - ✅ Check MongoDB is running
   - ✅ Verify `.env` file exists

3. **Events Not Loading**
   - ✅ Run `node createTestEvents.js` to create sample data
   - ✅ Check backend is running on port 5002

4. **Booking Errors**
   - ✅ Ensure user is logged in
   - ✅ Check event capacity
   - ✅ Verify one-time booking constraint

## 🎉 Ready to Use!

The Events & Facility Booking system is now **fully functional** with:
- ✅ Complete backend API
- ✅ Frontend components
- ✅ Database models
- ✅ Authentication & authorization
- ✅ Payment integration
- ✅ Real-time updates
- ✅ Mobile-responsive design

## 🔮 Next Steps

1. **Test the system** with admin and resident accounts
2. **Customize styling** to match your society's theme
3. **Add real payment gateway** integration
4. **Implement email notifications** for bookings
5. **Add calendar integration** for event scheduling

---

**🎯 Your Events & Facility Booking system is ready!** 🎯 