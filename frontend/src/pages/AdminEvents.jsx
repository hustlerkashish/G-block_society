import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Alert, useMediaQuery, useTheme, Switch,
  FormControlLabel, Divider, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Avatar,
  CircularProgress, Skeleton, Accordion, AccordionSummary,
  AccordionDetails, IconButton, Tooltip
} from '@mui/material';
import {
  Add as AddIcon, Event as EventIcon, LocationOn as LocationIcon,
  Schedule as ScheduleIcon, Group as GroupIcon, Payment as PaymentIcon,
  AttachMoney as MoneyIcon, FreeBreakfast as FreeIcon, ExpandMore as ExpandMoreIcon,
  Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon, People as PeopleIcon, Home as HomeIcon
} from '@mui/icons-material';
import api from '../utils/api';

function AdminEvents({ user }) {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createEventDialog, setCreateEventDialog] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    capacity: 50,
    description: '',
    isPaid: false,
    price: 0
  });
  const [editEvent, setEditEvent] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchEvents();
    fetchBookings();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      console.log('🔍 Fetching bookings for admin...');
      const response = await api.get('/bookings');
      console.log('✅ Bookings fetched:', response.data);
      
      // Debug: Check booking data structure
      if (response.data.length > 0) {
        const sampleBooking = response.data[0];
        console.log('📋 Sample booking structure:', {
          bookingId: sampleBooking._id,
          eventId: sampleBooking.eventId,
          eventIdType: typeof sampleBooking.eventId,
          eventIdIsObject: typeof sampleBooking.eventId === 'object',
          userId: sampleBooking.userId,
          userIdType: typeof sampleBooking.userId,
          bookedAt: sampleBooking.bookedAt,
          bookedAtType: typeof sampleBooking.bookedAt
        });
      }
      
      setBookings(response.data);
    } catch (err) {
      console.error('❌ Error fetching bookings:', err);
      setError('Failed to fetch bookings. Please try again.');
    }
  };

  const handleCreateEvent = async () => {
    try {
      const response = await api.post('/events', eventForm);
      setEvents([response.data, ...events]);
      setCreateEventDialog(false);
      setEventForm({
        title: '',
        date: '',
        time: '',
        location: '',
        capacity: 50,
        description: '',
        isPaid: false,
        price: 0
      });
      setSuccess('Event created successfully!');
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event. Please try again.');
    }
  };

  const handleEditEvent = (event) => {
    setEditEvent(event);
    setEventForm({
      title: event.title,
      date: event.date.split('T')[0],
      time: event.time,
      location: event.location,
      capacity: event.capacity,
      description: event.description,
      isPaid: event.isPaid,
      price: event.price
    });
    setCreateEventDialog(true);
  };

  const handleUpdateEvent = async () => {
    try {
      const response = await api.put(`/events/${editEvent._id}`, eventForm);
      setEvents(events.map(event => 
        event._id === editEvent._id ? response.data : event
      ));
      setCreateEventDialog(false);
      setEditEvent(null);
      setEventForm({
        title: '',
        date: '',
        time: '',
        location: '',
        capacity: 50,
        description: '',
        isPaid: false,
        price: 0
      });
      setSuccess('Event updated successfully!');
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${eventId}`);
        setEvents(events.filter(event => event._id !== eventId));
        setSuccess('Event deleted successfully!');
      } catch (err) {
        console.error('Error deleting event:', err);
        setError('Failed to delete event. Please try again.');
      }
    }
  };

  const getEventBookings = (eventId) => {
    const eventBookings = bookings.filter(booking => {
      // Handle both populated and unpopulated booking data
      const bookingEventId = booking.eventId && typeof booking.eventId === 'object' 
        ? booking.eventId._id 
        : booking.eventId;
      return bookingEventId === eventId;
    });
    console.log(`📊 Event ${eventId} bookings:`, eventBookings);
    return eventBookings;
  };

  const getEventRevenue = (eventId) => {
    const eventBookings = getEventBookings(eventId);
    const revenue = eventBookings.reduce((total, booking) => total + (booking.amount || 0), 0);
    console.log(`💰 Event ${eventId} revenue:`, revenue);
    return revenue;
  };

  const getEventStats = (eventId) => {
    const eventBookings = getEventBookings(eventId);
    const totalAttendees = eventBookings.reduce((sum, booking) => sum + booking.attendees, 0);
    const totalRevenue = getEventRevenue(eventId);
    const uniqueHouses = new Set(eventBookings.map(booking => booking.userId?.homeNumber)).size;
    
    console.log(`📈 Event ${eventId} stats:`, {
      totalAttendees,
      totalRevenue,
      uniqueHouses,
      totalBookings: eventBookings.length
    });
    
    return { totalAttendees, totalRevenue, uniqueHouses };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'primary';
      case 'ongoing': return 'success';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ p: isMobile ? 1 : 3 }}>
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
          Event Management & Analytics
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
        <Card>
          <CardContent>
            <Skeleton variant="text" width="60%" height={32} />
            {[1, 2, 3].map((item) => (
              <Box key={item} sx={{ mt: 2 }}>
                <Skeleton variant="rectangular" height={100} />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: isMobile ? 1 : 3,
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        gutterBottom 
        sx={{ 
          mb: isMobile ? 2 : 3,
          textAlign: isMobile ? 'center' : 'left'
        }}
      >
        Event Management & Analytics
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={isMobile ? 1 : 3} sx={{ mb: isMobile ? 2 : 4 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Box display="flex" alignItems="center" flexDirection={isMobile ? 'column' : 'row'}>
                <EventIcon color="primary" sx={{ 
                  mr: isMobile ? 0 : 2, 
                  mb: isMobile ? 1 : 0,
                  fontSize: isMobile ? 30 : 40 
                }} />
                <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <Typography variant={isMobile ? "h6" : "h6"} color="primary">
                    {events.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    Total Events
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Box display="flex" alignItems="center" flexDirection={isMobile ? 'column' : 'row'}>
                <PeopleIcon color="success" sx={{ 
                  mr: isMobile ? 0 : 2, 
                  mb: isMobile ? 1 : 0,
                  fontSize: isMobile ? 30 : 40 
                }} />
                <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <Typography variant={isMobile ? "h6" : "h6"} color="success.main">
                    {bookings.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    Total Bookings
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Box display="flex" alignItems="center" flexDirection={isMobile ? 'column' : 'row'}>
                <MoneyIcon color="warning" sx={{ 
                  mr: isMobile ? 0 : 2, 
                  mb: isMobile ? 1 : 0,
                  fontSize: isMobile ? 30 : 40 
                }} />
                <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <Typography variant={isMobile ? "h6" : "h6"} color="warning.main">
                    ₹{bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    Total Revenue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              <Box display="flex" alignItems="center" flexDirection={isMobile ? 'column' : 'row'}>
                <HomeIcon color="info" sx={{ 
                  mr: isMobile ? 0 : 2, 
                  mb: isMobile ? 1 : 0,
                  fontSize: isMobile ? 30 : 40 
                }} />
                <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <Typography variant={isMobile ? "h6" : "h6"} color="info.main">
                    {new Set(bookings.map(booking => booking.userId?.homeNumber)).size}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    Participating Houses
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Button */}
      <Box sx={{ 
        mb: isMobile ? 2 : 3,
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'flex-start'
      }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setCreateEventDialog(true)}
          size={isMobile ? "medium" : "large"}
          fullWidth={isMobile}
        >
          Create New Event
        </Button>
      </Box>

      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Events List with Analytics */}
      {events.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No events available at the moment.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        events.map((event) => {
          const stats = getEventStats(event._id);
          const eventBookings = getEventBookings(event._id);
          
          return (
            <Accordion key={event._id} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(event.date).toLocaleDateString()} at {event.time} • {event.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip 
                      label={event.status} 
                      color={getStatusColor(event.status)} 
                      size="small" 
                    />
                    <Chip 
                      label={event.isPaid ? `₹${event.price}` : 'Free'} 
                      color={event.isPaid ? 'warning' : 'success'} 
                      size="small" 
                      icon={event.isPaid ? <MoneyIcon /> : <FreeIcon />}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditEvent(event);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(event._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {/* Event Details */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Event Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {event.description}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Capacity:</strong> {event.attendees}/{event.capacity} attendees
                    </Typography>
                    <Typography variant="body2">
                      <strong>Created:</strong> {new Date(event.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>

                  {/* Analytics */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Booking Analytics
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                          <CardContent sx={{ p: 1, textAlign: 'center' }}>
                            <Typography variant="h6">{stats.totalAttendees}</Typography>
                            <Typography variant="caption">Total Attendees</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                          <CardContent sx={{ p: 1, textAlign: 'center' }}>
                            <Typography variant="h6">{stats.uniqueHouses}</Typography>
                            <Typography variant="caption">Participating Houses</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
                          <CardContent sx={{ p: 1, textAlign: 'center' }}>
                            <Typography variant="h6">₹{stats.totalRevenue.toLocaleString()}</Typography>
                            <Typography variant="caption">Total Revenue</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
                          <CardContent sx={{ p: 1, textAlign: 'center' }}>
                            <Typography variant="h6">{eventBookings.length}</Typography>
                            <Typography variant="caption">Total Bookings</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Booking Details Table */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Booking Details by House
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>House Number</TableCell>
                            <TableCell>Resident Name</TableCell>
                            <TableCell>Attendees</TableCell>
                            <TableCell>Amount Paid</TableCell>
                            <TableCell>Booking Date</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {eventBookings.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} align="center">
                                No bookings for this event
                              </TableCell>
                            </TableRow>
                          ) : (
                            eventBookings.map((booking) => (
                              <TableRow key={booking._id}>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <HomeIcon fontSize="small" />
                                    {booking.userId?.homeNumber || 'N/A'}
                                  </Box>
                                </TableCell>
                                <TableCell>{booking.userId?.username || 'N/A'}</TableCell>
                                <TableCell>{booking.attendees}</TableCell>
                                <TableCell>₹{booking.amount || 0}</TableCell>
                                <TableCell>{new Date(booking.bookedAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <Chip 
                                    label={booking.status} 
                                    color={booking.status === 'confirmed' ? 'success' : 'warning'} 
                                    size="small" 
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })
      )}

      {/* Create/Edit Event Dialog */}
      <Dialog 
        open={createEventDialog} 
        onClose={() => {
          setCreateEventDialog(false);
          setEditEvent(null);
          setEventForm({
            title: '',
            date: '',
            time: '',
            location: '',
            capacity: 50,
            description: '',
            isPaid: false,
            price: 0
          });
        }} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ textAlign: isMobile ? 'center' : 'left' }}>
          {editEvent ? 'Edit Event' : 'Create New Event'}
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="Enter event title..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Event Date"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Event Time"
                value={eventForm.time}
                onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                placeholder="Event location..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Capacity"
                value={eventForm.capacity}
                onChange={(e) => setEventForm({ ...eventForm, capacity: parseInt(e.target.value) })}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Event description..."
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={eventForm.isPaid}
                    onChange={(e) => setEventForm({ ...eventForm, isPaid: e.target.checked })}
                  />
                }
                label="Paid Event"
              />
            </Grid>
            {eventForm.isPaid && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price per Person"
                  value={eventForm.price}
                  onChange={(e) => setEventForm({ ...eventForm, price: parseInt(e.target.value) })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 1 : 0,
          p: isMobile ? 2 : 1
        }}>
          <Button 
            onClick={() => {
              setCreateEventDialog(false);
              setEditEvent(null);
              setEventForm({
                title: '',
                date: '',
                time: '',
                location: '',
                capacity: 50,
                description: '',
                isPaid: false,
                price: 0
              });
            }}
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
          >
            Cancel
          </Button>
          <Button 
            onClick={editEvent ? handleUpdateEvent : handleCreateEvent} 
            variant="contained" 
            disabled={!eventForm.title || !eventForm.date || !eventForm.location}
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
          >
            {editEvent ? 'Update Event' : 'Create Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminEvents;
