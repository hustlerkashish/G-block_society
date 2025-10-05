import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from "@mui/material";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Skeleton,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  AccountBalanceWallet as WalletIcon,
  Build as BuildIcon,
  Event as EventIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Description as DocumentIcon,
  BarChart as ChartIcon,
  AdminPanelSettings as AdminIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import api from '../utils/api';

function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalResidents: 0,
    pendingMaintenance: 0,
    activeComplaints: 0,
    upcomingEvents: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    totalBookings: 0,
    participatingHouses: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [eventsRes, bookingsRes, complaintsRes, maintenanceRes] = await Promise.all([
        api.get('/events'),
        api.get('/bookings'),
        api.get('/complaints'),
        api.get('/maintenance')
      ]);

      const events = eventsRes.data;
      const bookings = bookingsRes.data;
      const complaints = complaintsRes.data;
      const maintenance = maintenanceRes.data;

      // Calculate dashboard metrics
      const upcomingEvents = events.filter(event => event.status === 'upcoming').length;
      const totalBookings = bookings.length;
      const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
      const participatingHouses = new Set(bookings.map(booking => booking.userId?.homeNumber)).size;
      const activeComplaints = complaints.filter(complaint => complaint.status === 'pending').length;
      const pendingMaintenance = maintenance.filter(m => m.status === 'pending').length;

      setDashboardData({
        totalResidents: 150, // Mock data - replace with actual API call
        pendingMaintenance,
        activeComplaints,
        upcomingEvents,
        totalRevenue,
        pendingApprovals: activeComplaints + pendingMaintenance,
        totalBookings,
        participatingHouses,
      });

      // Generate recent activities from actual data
      const activities = [];
      
      // Add recent bookings
      bookings.slice(0, 3).forEach(booking => {
        activities.push({
          text: `New booking for ${booking.eventId?.title || 'Event'} by ${booking.userId?.homeNumber || 'Resident'}`,
          time: new Date(booking.bookedAt).toLocaleDateString(),
          type: 'booking'
        });
      });

      // Add recent complaints
      complaints.slice(0, 2).forEach(complaint => {
        activities.push({
          text: `New complaint from ${complaint.userId?.homeNumber || 'Resident'}: ${complaint.title}`,
          time: new Date(complaint.createdAt).toLocaleDateString(),
          type: 'complaint'
        });
      });

      setRecentActivities(activities.slice(0, 5));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { title: 'Add New Resident', icon: <AddIcon />, color: '#4caf50', path: '/members' },
    { title: 'Manage Maintenance', icon: <WalletIcon />, color: '#2196f3', path: '/maintenance' },
    { title: 'Handle Complaints', icon: <BuildIcon />, color: '#ff9800', path: '/complaints' },
    { title: 'Event Analytics', icon: <EventIcon />, color: '#9c27b0', path: '/admin-events' },
  ];

  const pendingItems = [
    { text: `Maintenance approval for ${dashboardData.pendingMaintenance} residents`, type: 'maintenance', count: dashboardData.pendingMaintenance },
    { text: `Complaints from ${dashboardData.activeComplaints} residents`, type: 'complaint', count: dashboardData.activeComplaints },
    { text: `${dashboardData.upcomingEvents} upcoming events`, type: 'event', count: dashboardData.upcomingEvents },
    { text: `${dashboardData.totalBookings} total bookings`, type: 'booking', count: dashboardData.totalBookings },
  ];

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ p: isMobile ? 1 : 3 }}>
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
          Admin Dashboard
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
          Admin Dashboard
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            textAlign: isMobile ? 'center' : 'left',
            fontSize: isMobile ? '0.875rem' : 'inherit'
          }}
        >
          Welcome back, {user.username}! Here's what's happening in your society.
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
                  bgcolor: '#4caf50', 
                  mr: isMobile ? 0 : 2,
                  mb: isMobile ? 1 : 0,
                  width: isMobile ? 40 : 56,
                  height: isMobile ? 40 : 56
                }}>
                  <PeopleIcon />
                </Avatar>
                <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <Typography variant={isMobile ? "h6" : "h6"}>{dashboardData.totalResidents}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    Total Residents
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
                  bgcolor: '#ff9800', 
                  mr: isMobile ? 0 : 2,
                  mb: isMobile ? 1 : 0,
                  width: isMobile ? 40 : 56,
                  height: isMobile ? 40 : 56
                }}>
                  <WalletIcon />
                </Avatar>
                <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <Typography variant={isMobile ? "h6" : "h6"}>{dashboardData.pendingMaintenance}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    Pending Payments
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
                  <Typography variant={isMobile ? "h6" : "h6"}>{dashboardData.activeComplaints}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    Active Complaints
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
                  <MoneyIcon />
                </Avatar>
                <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <Typography variant={isMobile ? "h6" : "h6"}>₹{dashboardData.totalRevenue.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    Event Revenue
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
                             activity.type === 'payment' ? <WalletIcon /> : <NotificationsIcon />}
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

        {/* Pending Approvals */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Typography 
                variant={isMobile ? "h6" : "h6"} 
                gutterBottom
                sx={{ textAlign: isMobile ? 'center' : 'left' }}
              >
                Pending Approvals ({dashboardData.pendingApprovals})
              </Typography>
              <List>
                {pendingItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 
                          item.type === 'maintenance' ? '#2196f3' :
                          item.type === 'complaint' ? '#ff9800' :
                          item.type === 'event' ? '#4caf50' : '#9c27b0'
                        }}>
                          {item.type === 'maintenance' ? <WalletIcon /> :
                           item.type === 'complaint' ? <BuildIcon /> :
                           item.type === 'event' ? <EventIcon /> : <SecurityIcon />}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Chip 
                              label={item.type} 
                              size="small" 
                              color={
                                item.type === 'maintenance' ? 'primary' :
                                item.type === 'complaint' ? 'warning' :
                                item.type === 'event' ? 'success' : 'secondary'
                              }
                            />
                            {item.count > 0 && (
                              <Chip 
                                label={item.count} 
                                size="small" 
                                color="error"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < pendingItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Society Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Typography 
                variant={isMobile ? "h6" : "h6"} 
                gutterBottom
                sx={{ textAlign: isMobile ? 'center' : 'left' }}
              >
                Society Overview
              </Typography>
              <Grid container spacing={isMobile ? 1 : 2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="primary">
                      {dashboardData.upcomingEvents}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upcoming Events
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="success.main">
                      {dashboardData.participatingHouses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Participating Houses
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="warning.main">
                      {dashboardData.totalBookings}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Bookings
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="info.main">
                      ₹{dashboardData.totalRevenue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Event Revenue
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

export default AdminDashboard; 