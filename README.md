# 🏢 G-Block Society Management System

A comprehensive web-based society management system built with React, Node.js, and MongoDB. This application provides a complete solution for managing residential societies, including member management, maintenance tracking, event booking, complaint handling, and more.

![Society Management System](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-16.0+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-orange)
![Material-UI](https://img.shields.io/badge/Material--UI-5.0+-purple)

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🏠 Core Management
- **Member Management**: Add, edit, and manage society residents
- **Maintenance Tracking**: Monitor and track maintenance requests and payments
- **Event Management**: Create and manage society events with booking system
- **Complaint System**: Submit and track complaints and service requests
- **Notice Board**: Publish and manage society announcements
- **Document Management**: Store and organize society documents

### 👤 User Features
- **Profile Management**: Complete user profiles with photo upload
- **Family Member Management**: Add and manage family members
- **Password Management**: Secure password change functionality
- **Dashboard Analytics**: Personalized dashboard with statistics
- **Mobile Responsive**: Optimized for all device sizes

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permissions for admin and residents
- **Password Hashing**: Secure password storage with bcrypt
- **File Upload Security**: Secure profile photo uploads

### 🎨 User Interface
- **Modern UI/UX**: Material-UI based responsive design
- **Dark/Light Mode**: Toggle between themes
- **Loading Animations**: Smooth and creative loading experiences
- **Real-time Updates**: Live data updates and notifications

## 🛠 Technology Stack

### Frontend
- **React 18.2.0**: Modern React with hooks and functional components
- **Material-UI 5**: Component library for consistent design
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **Vite**: Fast build tool and development server

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **Multer**: File upload middleware
- **bcrypt**: Password hashing

### Development Tools
- **ESLint**: Code linting
- **Git**: Version control
- **npm**: Package management

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/society-management.git
cd society-management
```

### Step 2: Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 3: Environment Setup

#### Backend Environment (.env)
Create a `.env` file in the `backend` directory:
```env
MONGO_URI=mongodb://localhost:27017/society_management
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5002
```

#### Frontend Environment
The frontend is configured to connect to `http://localhost:5002` by default.

### Step 4: Database Setup
1. Start MongoDB service
2. The application will automatically create the database and default users

### Step 5: Start the Application

#### Development Mode
```bash
# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

#### Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd backend
npm start
```

## 📖 Usage

### Default Login Credentials

#### Admin Access
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Administrator

#### Resident Access
- **Username**: `H101`
- **Password**: `resident123`
- **Role**: Resident

### Key Features Usage

#### 1. Profile Management
- Upload profile photos
- Edit personal information
- Manage family members
- Change passwords

#### 2. Event Booking
- Browse available events
- Book events for family members
- View booking history
- Cancel bookings

#### 3. Maintenance
- Submit maintenance requests
- Track payment status
- View maintenance history
- Pay maintenance fees

#### 4. Complaints
- Submit complaints
- Track complaint status
- View complaint history
- Receive updates

## 📁 Project Structure

```
society-management/
├── backend/
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── uploads/             # File uploads
│   ├── server.js            # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   ├── assets/          # Static assets
│   │   └── App.jsx          # Main app component
│   ├── public/              # Public assets
│   └── package.json
├── README.md
└── LICENSE
```

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Profile Endpoints
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile/:userId` - Update profile
- `PUT /api/profile/:userId/photo` - Upload profile photo
- `PUT /api/profile/:userId/password` - Change password

### Family Management
- `GET /api/profile/family/:userId` - Get family members
- `POST /api/profile/family/:userId` - Add family member
- `DELETE /api/profile/family/:userId/:memberId` - Remove family member

### Event Management
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### Booking Management
- `GET /api/bookings` - Get bookings
- `POST /api/bookings` - Create booking
- `DELETE /api/bookings/:id` - Cancel booking

### Maintenance
- `GET /api/maintenance` - Get maintenance records
- `POST /api/maintenance` - Submit maintenance request
- `PUT /api/maintenance/:id` - Update maintenance status

### Complaints
- `GET /api/complaints` - Get complaints
- `POST /api/complaints` - Submit complaint
- `PUT /api/complaints/:id` - Update complaint status

## 👥 User Roles

### Administrator
- Full system access
- Member management
- Event creation and management
- Complaint resolution
- Maintenance oversight
- Financial management
- System configuration

### Resident
- Personal profile management
- Event booking
- Complaint submission
- Maintenance requests
- Payment tracking
- Document access
- Notice viewing

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Profile Management
![Profile](screenshots/profile.png)

### Event Booking
![Events](screenshots/events.png)

### Mobile Responsive
![Mobile](screenshots/mobile.png)

## 🎯 Key Features in Detail

### 1. Profile Photo Management
- **Upload**: Drag & drop or click to upload
- **Preview**: Real-time image preview
- **Validation**: File type and size validation
- **Storage**: Secure file storage with unique naming
- **Display**: Profile photos shown in header and throughout the app

### 2. Loading Experience
- **Creative Animation**: Smooth gradient backgrounds with floating elements
- **Progressive Loading**: Staggered animations for different elements
- **Progress Tracking**: Real-time loading progress with percentage
- **Feature Showcase**: Animated icons representing system features
- **Responsive Design**: Optimized for all screen sizes

### 3. Family Member Management
- **Add Members**: Complete family member profiles
- **Relationship Types**: Spouse, child, parent, sibling, other family
- **Age Validation**: Age range validation (0-120 years)
- **Optional Phone**: Optional phone number for family members
- **Easy Removal**: One-click family member removal

### 4. Event Booking System
- **Event Creation**: Admin can create events with details
- **Booking Management**: Residents can book events for family
- **One-time Booking**: Prevents duplicate bookings per event
- **Booking Analytics**: Admin can view booking statistics
- **House-wise Tracking**: Track bookings by house number

### 5. Maintenance & Billing
- **Request Submission**: Easy maintenance request submission
- **Status Tracking**: Real-time status updates
- **Payment Integration**: Payment tracking and management
- **History View**: Complete maintenance history
- **Admin Oversight**: Admin can manage all maintenance requests

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
MONGO_URI=mongodb://localhost:27017/society_management

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=5002

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/
```

#### Frontend Configuration
```javascript
// src/utils/api.js
const API_BASE_URL = 'http://localhost:5002/api';
```

### Database Configuration
The application uses MongoDB with the following collections:
- `users` - User accounts and profiles
- `familymembers` - Family member information
- `events` - Society events
- `bookings` - Event bookings
- `maintenance` - Maintenance requests
- `complaints` - Complaint records

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Serve the build folder using a web server
3. Configure API base URL for production

### Docker Deployment
```dockerfile
# Backend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5002
CMD ["npm", "start"]
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Profile photo upload
- [ ] Family member management
- [ ] Event creation and booking
- [ ] Maintenance request submission
- [ ] Complaint submission
- [ ] Mobile responsiveness
- [ ] Dark/light mode toggle

### Automated Testing
```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
# Check MongoDB service
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod
```

#### 2. Port Already in Use
```bash
# Check port usage
lsof -i :5002

# Kill process using the port
kill -9 <PID>
```

#### 3. File Upload Issues
```bash
# Check uploads directory permissions
chmod 755 backend/uploads/

# Install multer if missing
npm install multer
```

#### 4. JWT Secret Missing
```bash
# Add JWT_SECRET to .env file
echo "JWT_SECRET=your-secret-key" >> backend/.env
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Test thoroughly before submitting
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@societymanagement.com
- Documentation: [Wiki](https://github.com/yourusername/society-management/wiki)

## 🙏 Acknowledgments

- Material-UI for the component library
- MongoDB for the database
- React team for the amazing framework
- All contributors and testers

---

**Made with ❤️ for better society management**

