import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Alert, useMediaQuery, useTheme, Fab, Switch,
  FormControlLabel, Divider, Radio, RadioGroup, FormControl,
  FormLabel, InputAdornment, CircularProgress, Skeleton
} from '@mui/material';
import {
  Add as AddIcon, Event as EventIcon, LocationOn as LocationIcon,
  Schedule as ScheduleIcon, Group as GroupIcon, Payment as PaymentIcon,
  AttachMoney as MoneyIcon, FreeBreakfast as FreeIcon
} from '@mui/icons-material';
import api from '../utils/api';

function Events({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createEventDialog, setCreateEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [userFamilyCount, setUserFamilyCount] = useState(1);
  const [userBookings, setUserBookings] = useState([]);
  
  const [bookingForm, setBookingForm] = useState({
    eventId: '',
    attendees: 1,
    specialRequirements: '',
    familyMembers: 1,
    extraAttendees: 0
  });

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

  const [paymentForm, setPaymentForm] = useState({
    method: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    amount: 0
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch events and user data on component mount
  useEffect(() => {
    fetchEvents();
    if (user && user.role === 'resident') {
      fetchUserFamilyCount();
      fetchUserBookings();
    }
  }, [user]);

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

  const fetchUserFamilyCount = async () => {
    try {
      // For now, using mock data since we don't have the exact API endpoint
      // In real implementation, this would be: const response = await api.get(`/auth/users/${user._id}`);
      // setUserFamilyCount(response.data.familyMembers || 1);
      
      // Mock data - replace with actual API call
      setUserFamilyCount(3); // Assuming user has 3 family members
    } catch (err) {
      console.error('Error fetching user family count:', err);
      setError('Failed to fetch family member count');
    }
  };

  const fetchUserBookings = async () => {
    try {
      const response = await api.get(`/bookings/user/${user._id}`);
      console.log('🔍 User bookings fetched:', response.data);
      
      // Debug: Check user booking data structure
      if (response.data.length > 0) {
        const sampleBooking = response.data[0];
        console.log('📋 Sample user booking structure:', {
          bookingId: sampleBooking._id,
          eventId: sampleBooking.eventId,
          eventIdType: typeof sampleBooking.eventId,
          eventIdIsObject: typeof sampleBooking.eventId === 'object',
          bookedAt: sampleBooking.bookedAt,
          bookedAtType: typeof sampleBooking.bookedAt
        });
      }
      
      setUserBookings(response.data);
    } catch (err) {
      console.error('Error fetching user bookings:', err);
      setError('Failed to fetch your bookings');
    }
  };

  const handleBookEvent = (event) => {
    // Remove duplicate booking check to allow multiple bookings
    // const hasBooked = userBookings.some(booking => booking.eventId === event._id);
    // if (hasBooked) {
    //   setError('You have already booked this event!');
    //   return;
    // }

    setSelectedEvent(event);
    setBookingForm({
      eventId: event._id,
      attendees: 1,
      specialRequirements: '',
      familyMembers: userFamilyCount,
      extraAttendees: 0
    });
    setDialogOpen(true);
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
      date: event.date.split('T')[0], // Convert to date format
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

  const confirmBooking = () => {
    const event = selectedEvent;
    const totalAttendees = bookingForm.attendees;
    const familyMembers = bookingForm.familyMembers;
    const extraAttendees = Math.max(0, totalAttendees - familyMembers);

    if (event.isPaid) {
      // For paid events, always show payment
      setPaymentForm({
        method: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        amount: event.price * totalAttendees
      });
      setPaymentDialog(true);
      setDialogOpen(false);
    } else {
      // For free events, check if extra attendees need payment
      if (extraAttendees > 0) {
        setPaymentForm({
          method: '',
          cardNumber: '',
          expiry: '',
          cvv: '',
          amount: 100 * extraAttendees // ₹100 per extra attendee
        });
        setPaymentDialog(true);
        setDialogOpen(false);
      } else {
        // Free booking within family limit
        completeBooking();
      }
    }
  };

  const completeBooking = async () => {
    try {
      const bookingData = {
        eventId: selectedEvent._id,
        attendees: bookingForm.attendees,
        specialRequirements: bookingForm.specialRequirements,
        amount: paymentForm.amount || 0
      };

      const response = await api.post('/bookings', bookingData);
      
      // Update events list with new attendee count
      await fetchEvents();
      
      // Update user bookings
      await fetchUserBookings();

      setPaymentDialog(false);
      setDialogOpen(false);
      setSuccess('Booking confirmed successfully!');
    } catch (err) {
      console.error('Error completing booking:', err);
      setError('Failed to complete booking. Please try again.');
    }
  };

  const handlePayment = () => {
    // Simulate payment processing
    setError('');
    setPaymentLoading(true);
    setTimeout(() => {
      try {
        // In a real app, this would make an API call to process payment
        completeBooking();
      } catch (err) {
        setError('Payment failed. Please try again.');
      } finally {
        setPaymentLoading(false);
      }
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'primary';
      case 'ongoing': return 'success';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const hasUserBooked = (eventId) => {
    return userBookings.some(booking => booking.eventId === eventId);
  };

  const getUserBookingStatus = (eventId) => {
    const booking = userBookings.find(booking => booking.eventId === eventId);
    return booking ? `Booked (${booking.attendees} people)` : null;
  };

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ p: isMobile ? 1 : 3 }}>
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
          Events & Facility Booking
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
        Events & Facility Booking
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
                 <ScheduleIcon color="warning" sx={{ 
                   mr: isMobile ? 0 : 2, 
                   mb: isMobile ? 1 : 0,
                   fontSize: isMobile ? 30 : 40 
                 }} />
                 <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                   <Typography variant={isMobile ? "h6" : "h6"} color="warning.main">
                     {events.filter(e => e.status === 'upcoming').length}
                   </Typography>
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
                <Box display="flex" alignItems="center" flexDirection={isMobile ? 'column' : 'row'}>
                  <GroupIcon color="success" sx={{ 
                    mr: isMobile ? 0 : 2, 
                    mb: isMobile ? 1 : 0,
                    fontSize: isMobile ? 30 : 40 
                  }} />
                  <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                    <Typography variant={isMobile ? "h6" : "h6"} color="success.main">
                      {events.reduce((sum, event) => sum + event.attendees, 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                      Total Attendees
                      </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

                   {/* User Bookings Summary Card - Only for Residents */}
          {user.role === 'resident' && (
            <Grid item xs={6} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                  <Box display="flex" alignItems="center" flexDirection={isMobile ? 'column' : 'row'}>
                    <EventIcon color="info" sx={{ 
                      mr: isMobile ? 0 : 2, 
                      mb: isMobile ? 1 : 0,
                      fontSize: isMobile ? 30 : 40 
                    }} />
                    <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                      <Typography variant={isMobile ? "h6" : "h6"} color="info.main">
                        {userBookings.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                        My Bookings
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
      </Grid>

             {/* Action Button for Admin */}
       {user.role === 'admin' && (
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
       )}

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

             {/* Events List */}
       <Card>
         <CardContent sx={{ p: isMobile ? 1 : 2 }}>
           <Typography 
             variant={isMobile ? "h6" : "h6"} 
             gutterBottom 
             sx={{ 
               mb: isMobile ? 1 : 2,
               textAlign: isMobile ? 'center' : 'left'
             }}
           >
             Available Events
           </Typography>
          
          {events.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No events available at the moment.
            </Typography>
          ) : (
                         <List sx={{ p: 0 }}>
               {events.map((event, index) => (
                 <ListItem 
                   key={event._id}
                   sx={{ 
                     flexDirection: isMobile ? 'column' : 'row',
                     alignItems: isMobile ? 'stretch' : 'center',
                     p: isMobile ? 1 : 2
                   }}
                 >
                   <ListItemText
                     primary={
                       <Box 
                         display="flex" 
                         alignItems="center" 
                         gap={1}
                         flexDirection={isMobile ? 'column' : 'row'}
                         sx={{ mb: isMobile ? 1 : 0 }}
                       >
                         <Typography 
                           variant={isMobile ? "h6" : "h6"}
                           sx={{ textAlign: isMobile ? 'center' : 'left' }}
                         >
                           {event.title}
                         </Typography>
                         <Box display="flex" gap={1} flexWrap="wrap" justifyContent={isMobile ? 'center' : 'flex-start'}>
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
                         </Box>
                       </Box>
                     }
                                         secondary={
                       <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                         <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.875rem' : 'inherit' }}>
                           Date: {new Date(event.date).toLocaleDateString()} at {event.time}
                         </Typography>
                         <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.875rem' : 'inherit' }}>
                           Location: {event.location}
                         </Typography>
                         <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.875rem' : 'inherit' }}>
                           Capacity: {event.attendees}/{event.capacity} attendees
                         </Typography>
                         {event.description && (
                           <Typography variant="body2" sx={{ mt: 1, fontSize: isMobile ? '0.875rem' : 'inherit' }}>
                             {event.description}
                           </Typography>
                         )}
                       </Box>
                     }
                  />
                                     <ListItemSecondaryAction sx={{ 
                     position: isMobile ? 'static' : 'absolute',
                     mt: isMobile ? 2 : 0,
                     display: 'flex',
                     justifyContent: isMobile ? 'center' : 'flex-end'
                   }}>
                      {user.role === 'admin' ? (
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1,
                          flexDirection: isMobile ? 'column' : 'row',
                          width: isMobile ? '100%' : 'auto'
                        }}>
                          <Button
                            variant="outlined"
                            size={isMobile ? "medium" : "small"}
                            onClick={() => handleEditEvent(event)}
                            fullWidth={isMobile}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size={isMobile ? "medium" : "small"}
                            onClick={() => handleDeleteEvent(event._id)}
                            fullWidth={isMobile}
                          >
                            Delete
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: isMobile ? 'center' : 'flex-end', 
                          gap: 1,
                          width: isMobile ? '100%' : 'auto'
                        }}>
                          {hasUserBooked(event._id) ? (
                            <Chip 
                              label={getUserBookingStatus(event._id)} 
                              color="success" 
                              size="small" 
                            />
                          ) : (
                            <Button
                              variant="contained"
                              size={isMobile ? "medium" : "small"}
                              onClick={() => handleBookEvent(event)}
                              disabled={event.attendees >= event.capacity}
                              fullWidth={isMobile}
                            >
                              {event.attendees >= event.capacity ? 'Full' : 'Book Now'}
                            </Button>
                          )}
                        </Box>
                      )}
                    </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
         </CardContent>
       </Card>

       {/* User's Booked Events - Only for Residents */}
       {user.role === 'resident' && userBookings.length > 0 && (
         <Card sx={{ mt: 3 }}>
           <CardContent>
             <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
               My Booked Events
             </Typography>
             <List>
               {userBookings.map((booking, index) => {
                 // Handle both populated and unpopulated booking data
                 const event = booking.eventId && typeof booking.eventId === 'object' 
                   ? booking.eventId 
                   : events.find(e => e._id === booking.eventId);
                 
                 if (!event) {
                   console.warn('Event not found for booking:', booking);
                   return null;
                 }
                 
                 return (
                   <ListItem key={index}>
                     <ListItemText
                       primary={
                         <Box display="flex" alignItems="center" gap={1}>
                           <Typography variant="h6">
                             {event.title}
                           </Typography>
                           <Chip 
                             label={booking.status} 
                             color="success" 
                             size="small" 
                           />
                         </Box>
                       }
                       secondary={
                         <Box>
                           <Typography variant="body2" color="text.secondary">
                             Date: {new Date(event.date).toLocaleDateString()} at {event.time}
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                             Location: {event.location}
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                             Booked for: {booking.attendees} people
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                             Booked on: {new Date(booking.bookedAt).toLocaleDateString()}
                           </Typography>
                           {booking.amount > 0 && (
                             <Typography variant="body2" color="text.secondary">
                               Amount: ₹{booking.amount}
                             </Typography>
                           )}
                         </Box>
                       }
                     />
                   </ListItem>
                 );
               })}
             </List>
           </CardContent>
         </Card>
       )}

               {/* Booking Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)} 
          maxWidth="sm" 
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            Book Event
          </DialogTitle>
          <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
           {selectedEvent && (
             <Box sx={{ mb: 3 }}>
               <Typography variant="h6" gutterBottom>
                 {selectedEvent.title}
               </Typography>
               <Typography variant="body2" color="text.secondary">
                 Date: {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}
               </Typography>
               <Typography variant="body2" color="text.secondary">
                 Location: {selectedEvent.location}
               </Typography>
               <Box sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                 <Typography variant="body2" color="text.secondary">
                   Event Type: {selectedEvent.isPaid ? `Paid - ₹${selectedEvent.price} per person` : 'Free'}
                 </Typography>
                 <Typography variant="body2" color="text.secondary">
                   Your Family Members: {userFamilyCount}
                 </Typography>
               </Box>
             </Box>
           )}
           <Grid container spacing={2}>
             <Grid item xs={12}>
               <TextField
                 fullWidth
                 type="number"
                 label="Number of Attendees"
                 value={bookingForm.attendees}
                 onChange={(e) => {
                   const attendees = parseInt(e.target.value);
                   const extra = Math.max(0, attendees - userFamilyCount);
                   setBookingForm({ 
                     ...bookingForm, 
                     attendees,
                     extraAttendees: extra
                   });
                 }}
                 inputProps={{ min: 1, max: selectedEvent ? selectedEvent.capacity - selectedEvent.attendees : 1 }}
               />
             </Grid>
             
             {!selectedEvent?.isPaid && bookingForm.extraAttendees > 0 && (
               <Grid item xs={12}>
                 <Alert severity="info">
                   <Typography variant="body2">
                     You're booking for {bookingForm.extraAttendees} extra attendees beyond your family limit.
                     Additional charge: ₹{100 * bookingForm.extraAttendees}
                   </Typography>
                 </Alert>
               </Grid>
             )}

             {selectedEvent?.isPaid && (
               <Grid item xs={12}>
                 <Alert severity="info">
                   <Typography variant="body2">
                     Total Amount: ₹{selectedEvent.price * bookingForm.attendees}
                   </Typography>
                 </Alert>
               </Grid>
             )}

             <Grid item xs={12}>
               <TextField
                 fullWidth
                 multiline
                 rows={3}
                 label="Special Requirements"
                 value={bookingForm.specialRequirements}
                 onChange={(e) => setBookingForm({ ...bookingForm, specialRequirements: e.target.value })}
                 placeholder="Any special requirements or requests..."
               />
             </Grid>
           </Grid>
         </DialogContent>
                   <DialogActions sx={{ 
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 1 : 0,
            p: isMobile ? 2 : 1
          }}>
            <Button 
              onClick={() => setDialogOpen(false)}
              fullWidth={isMobile}
              size={isMobile ? "large" : "medium"}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmBooking} 
              variant="contained"
              fullWidth={isMobile}
              size={isMobile ? "large" : "medium"}
            >
              {selectedEvent?.isPaid ? 'Proceed to Payment' : 'Confirm Booking'}
            </Button>
          </DialogActions>
       </Dialog>

                               {/* Create/Edit Event Dialog (Admin Only) */}
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

               {/* Payment Dialog */}
        <Dialog 
          open={paymentDialog} 
          onClose={() => setPaymentDialog(false)} 
          maxWidth="sm" 
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            <Box display="flex" alignItems="center" gap={1} justifyContent={isMobile ? 'center' : 'flex-start'}>
              <PaymentIcon color="primary" />
              Payment Required
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
           <Box sx={{ mb: 3 }}>
             <Typography variant="h6" gutterBottom>
               {selectedEvent?.title}
             </Typography>
             <Typography variant="body2" color="text.secondary">
               Amount: ₹{paymentForm.amount}
             </Typography>
           </Box>
           
           <FormControl component="fieldset" sx={{ mb: 2 }}>
             <FormLabel component="legend">Payment Method</FormLabel>
             <RadioGroup
               value={paymentForm.method}
               onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
             >
               <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
               <FormControlLabel value="upi" control={<Radio />} label="UPI" />
               <FormControlLabel value="netbanking" control={<Radio />} label="Net Banking" />
             </RadioGroup>
           </FormControl>

           {paymentForm.method === 'card' && (
             <Grid container spacing={2}>
               <Grid item xs={12}>
                 <TextField
                   fullWidth
                   label="Card Number"
                   value={paymentForm.cardNumber}
                   onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                   placeholder="1234 5678 9012 3456"
                 />
               </Grid>
               <Grid item xs={6}>
                 <TextField
                   fullWidth
                   label="Expiry Date"
                   value={paymentForm.expiry}
                   onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                   placeholder="MM/YY"
                 />
               </Grid>
               <Grid item xs={6}>
                 <TextField
                   fullWidth
                   label="CVV"
                   value={paymentForm.cvv}
                   onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                   placeholder="123"
                 />
               </Grid>
             </Grid>
           )}

           {paymentForm.method === 'upi' && (
             <TextField
               fullWidth
               label="UPI ID"
               value={paymentForm.cardNumber}
               onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
               placeholder="example@upi"
             />
           )}

           {paymentForm.method === 'netbanking' && (
             <TextField
               select
               fullWidth
               label="Select Bank"
               value={paymentForm.cardNumber}
               onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
             >
               <MenuItem value="sbi">State Bank of India</MenuItem>
               <MenuItem value="hdfc">HDFC Bank</MenuItem>
               <MenuItem value="icici">ICICI Bank</MenuItem>
               <MenuItem value="axis">Axis Bank</MenuItem>
             </TextField>
           )}
         </DialogContent>
                   <DialogActions sx={{ 
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 1 : 0,
            p: isMobile ? 2 : 1
          }}>
            <Button 
              onClick={() => setPaymentDialog(false)}
              fullWidth={isMobile}
              size={isMobile ? "large" : "medium"}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              variant="contained" 
              disabled={!paymentForm.method || paymentLoading}
              fullWidth={isMobile}
              size={isMobile ? "large" : "medium"}
            >
              {paymentLoading ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={16} />
                  Processing...
                </Box>
              ) : (
                `Pay ₹${paymentForm.amount}`
              )}
            </Button>
          </DialogActions>
       </Dialog>
     </Box>
   );
 }
 
 export default Events; 