import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
  useTheme,
  Skeleton,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Home as HomeIcon,
  AccountBalanceWallet as WalletIcon,
  Build as BuildIcon,
  Event as EventIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Description as DocumentIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import api from '../utils/api';
import { debugUserData, checkUserValidity } from '../utils/debug';

function UserDashboard({ user }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    homeNumber: user?.homeNumber || 'N/A',
    name: user?.name || `Resident ${user?.homeNumber || 'N/A'}`,
    outstandingDues: 0,
    maintenanceRequests: 0,
    upcomingEvents: 0,
    recentNotices: 0,
    totalBookings: 0,
    totalSpent: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState('');

  // Debug: Log user data
  useEffect(() => {
    console.log('🏠 UserDashboard - Component mounted');
    debugUserData(user);
    
    const validation = checkUserValidity(user);
    if (!validation.valid) {
      console.error('❌ UserDashboard - User validation failed:', validation.issues);
      setError(`User data is invalid: ${validation.issues.join(', ')}`);
      return;
    }
    
    console.log('✅ UserDashboard - User data is valid, fetching user data...');
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if user has _id
      if (!user._id) {
        console.error('User ID not found:', user);
        setError('User data is incomplete. Please login again.');
        setLoading(false);
        return;
      }
      
      // Fetch user's data in parallel
      const [bookingsRes, complaintsRes, maintenanceRes] = await Promise.all([
        api.get(`/bookings/user/${user._id}`).catch(err => ({ data: [] })),
        api.get(`/complaints/user/${user._id}`).catch(err => ({ data: [] })),
        api.get(`/maintenance/user/${user._id}`).catch(err => ({ data: [] }))
      ]);

      const bookings = bookingsRes.data || [];
      const complaints = complaintsRes.data || [];
      const maintenance = maintenanceRes.data || [];

      // Calculate user metrics
      const totalBookings = bookings.length;
      const totalSpent = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
      const upcomingEvents = bookings.filter(booking => 
        booking.eventId && new Date(booking.eventId.date) > new Date()
      ).length;
      const maintenanceRequests = complaints.filter(complaint => 
        complaint.status === 'pending'
      ).length;
      const outstandingDues = maintenance.filter(m => 
        m.status === 'pending'
      ).reduce((sum, m) => sum + (m.amount || 0), 0);

      setUserData({
        homeNumber: user.homeNumber || 'N/A',
        name: user.name || `Resident ${user.homeNumber || 'N/A'}`,
        outstandingDues,
        maintenanceRequests,
        upcomingEvents,
        recentNotices: 3, // Mock data
        totalBookings,
        totalSpent,
      });

      // Generate recent activities from actual data
      const activities = [];
      
      // Add recent bookings
      bookings.slice(0, 2).forEach(booking => {
        activities.push({
          text: `Booked ${booking.eventId?.title || 'Event'} for ${booking.attendees} people`,
          time: new Date(booking.bookedAt).toLocaleDateString(),
          type: 'booking'
        });
      });

      // Add recent complaints
      complaints.slice(0, 2).forEach(complaint => {
        activities.push({
          text: `Complaint: ${complaint.title} - ${complaint.status}`,
          time: new Date(complaint.createdAt).toLocaleDateString(),
          type: 'complaint'
        });
      });

      // Add maintenance payments
      maintenance.filter(m => m.status === 'completed').slice(0, 1).forEach(m => {
        activities.push({
          text: `Maintenance payment of ₹${m.amount} completed`,
          time: new Date(m.updatedAt).toLocaleDateString(),
          type: 'payment'
        });
      });

      setRecentActivities(activities.slice(0, 4));

    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { title: 'Pay Maintenance', icon: <WalletIcon />, color: '#4caf50', path: '/maintenance' },
    { title: 'Raise Complaint', icon: <BuildIcon />, color: '#ff9800', path: '/complaints' },
    { title: 'Book Facility', icon: <EventIcon />, color: '#2196f3', path: '/events' },
    { title: 'View Notices', icon: <NotificationsIcon />, color: '#9c27b0', path: '/notices' },
  ];

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ p: isMobile ? 1 : 3 }}>
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
          Welcome back, {userData.name}!
        </Typography>
        <Grid container spacing={isMobile ? 1 : 3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={6} sm={6} md={3} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="rectangular" height={60} />
                  <Skeleton variant="text" sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                {[1, 2, 3].map((item) => (
                  <Box key={item} sx={{ mt: 2 }}>
                    <Skeleton variant="rectangular" height={60} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                {[1, 2, 3].map((item) => (
                  <Box key={item} sx={{ mt: 2 }}>
                    <Skeleton variant="rectangular" height={60} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: isMobile ? 1 : 3,
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      {/* Welcome Section */}
      <Box sx={{ mb: isMobile ? 2 : 4 }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom
          sx={{ textAlign: isMobile ? 'center' : 'left' }}
        >
          Welcome back, {userData.name}!
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            textAlign: isMobile ? 'center' : 'left',
            fontSize: isMobile ? '0.875rem' : 'inherit'
          }}
        >
          Home Number: {userData.homeNumber}
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={isMobile ? 1 : 3} sx={{ mb: isMobile ? 2 : 4 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row'
              }}>
                <Avatar sx={{ 
                  bgcolor: '#ff9800', 
                  mr: isMobile ? 0 : 2,
                  mb: isMobile ? 1 : 0,
                  width: isMobile ? 40 : 56,
                  height: isMobile ? 40 : 56
                }}>
                  <ReceiptIcon />
                </Avatar>
                <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <Typography variant={isMobile ? "h6" : "h6"}>₹{userData.outstandingDues}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    Outstanding Dues
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row'
              }}>
                <Avatar sx={{ 
                  bgcolor: '#2196f3', 
                  mr: isMobile ? 0 : 2,
                  mb: isMobile ? 1 : 0,
                  width: isMobile ? 40 : 56,
                  height: isMobile ? 40 : 56
                }}>
                  <BuildIcon />
                </Avatar>
                <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <Typography variant={isMobile ? "h6" : "h6"}>{userData.maintenanceRequests}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    Active Requests
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row'
              }}>
                <Avatar sx={{ 
                  bgcolor: '#4caf50', 
                  mr: isMobile ? 0 : 2,
                  mb: isMobile ? 1 : 0,
                  width: isMobile ? 40 : 56,
                  height: isMobile ? 40 : 56
                }}>
                  <EventIcon />
                </Avatar>
                <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <Typography variant={isMobile ? "h6" : "h6"}>{userData.upcomingEvents}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    Upcoming Events
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row'
              }}>
                <Avatar sx={{ 
                  bgcolor: '#9c27b0', 
                  mr: isMobile ? 0 : 2,
                  mb: isMobile ? 1 : 0,
                  width: isMobile ? 40 : 56,
                  height: isMobile ? 40 : 56
                }}>
                  <PeopleIcon />
                </Avatar>
                <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <Typography variant={isMobile ? "h6" : "h6"}>{userData.totalBookings}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    Total Bookings
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={isMobile ? 1 : 3} sx={{ mb: isMobile ? 2 : 4 }}>
        <Grid item xs={12}>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            gutterBottom
            sx={{ textAlign: isMobile ? 'center' : 'left' }}
          >
            Quick Actions
          </Typography>
        </Grid>
        {quickActions.map((action, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                '&:hover': { boxShadow: 3 },
                height: isMobile ? 'auto' : '100%'
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ 
                textAlign: 'center',
                p: isMobile ? 1 : 2
              }}>
                <Avatar sx={{ 
                  bgcolor: action.color, 
                  mx: 'auto', 
                  mb: isMobile ? 1 : 2,
                  width: isMobile ? 40 : 56,
                  height: isMobile ? 40 : 56
                }}>
                  {action.icon}
                </Avatar>
                <Typography 
                  variant={isMobile ? "body1" : "h6"}
                  sx={{ fontSize: isMobile ? '0.875rem' : 'inherit' }}
                >
                  {action.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={isMobile ? 1 : 3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Typography 
                variant={isMobile ? "h6" : "h6"} 
                gutterBottom
                sx={{ textAlign: isMobile ? 'center' : 'left' }}
              >
                Recent Activities
              </Typography>
              {recentActivities.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No recent activities
                </Typography>
              ) : (
                <List>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 
                            activity.type === 'booking' ? '#4caf50' :
                            activity.type === 'complaint' ? '#ff9800' :
                            activity.type === 'payment' ? '#2196f3' : '#9c27b0'
                          }}>
                            {activity.type === 'booking' ? <EventIcon /> :
                             activity.type === 'complaint' ? <BuildIcon /> :
                             activity.type === 'payment' ? <ReceiptIcon /> : <NotificationsIcon />}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.text}
                          secondary={activity.time}
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Important Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Typography 
                variant={isMobile ? "h6" : "h6"} 
                gutterBottom
                sx={{ textAlign: isMobile ? 'center' : 'left' }}
              >
                Important Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Next Maintenance Due
                </Typography>
                <Typography variant="h6" color="primary">
                  December 15, 2024
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Event Spending
                </Typography>
                <Typography variant="h6" color="success.main">
                  ₹{userData.totalSpent.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Society Office Hours
                </Typography>
                <Typography variant="body1">
                  Monday - Saturday: 9:00 AM - 6:00 PM
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Emergency Contact
                </Typography>
                <Typography variant="body1">
                  +91 98765 43210
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Stats */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Typography 
                variant={isMobile ? "h6" : "h6"} 
                gutterBottom
                sx={{ textAlign: isMobile ? 'center' : 'left' }}
              >
                Your Statistics
              </Typography>
              <Grid container spacing={isMobile ? 1 : 2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="primary">
                      {userData.totalBookings}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Bookings
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="success.main">
                      ₹{userData.totalSpent.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Event Spending
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="warning.main">
                      {userData.maintenanceRequests}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Requests
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="info.main">
                      {userData.upcomingEvents}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upcoming Events
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserDashboard; 