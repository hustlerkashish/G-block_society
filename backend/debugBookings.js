require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Booking = require('./models/Booking');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/society_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const debugBookings = async () => {
  try {
    console.log('🔍 Debugging booking data structure...');

    // Get all bookings with populated data
    const bookings = await Booking.find()
      .populate('userId', 'username homeNumber name email phone')
      .populate('eventId', 'title date time location capacity attendees');

    console.log(`📋 Found ${bookings.length} bookings`);

    if (bookings.length === 0) {
      console.log('❌ No bookings found. Create some test bookings first.');
      return;
    }

    // Display sample booking structure
    const sampleBooking = bookings[0];
    console.log('\n📊 Sample Booking Structure:');
    console.log('Booking ID:', sampleBooking._id);
    console.log('User ID:', sampleBooking.userId);
    console.log('Event ID:', sampleBooking.eventId);
    console.log('Attendees:', sampleBooking.attendees);
    console.log('Amount:', sampleBooking.amount);
    console.log('Status:', sampleBooking.status);
    console.log('Booked At:', sampleBooking.bookedAt);
    console.log('Booked At Type:', typeof sampleBooking.bookedAt);

    // Check if eventId is populated
    if (sampleBooking.eventId && typeof sampleBooking.eventId === 'object') {
      console.log('\n✅ Event ID is populated:');
      console.log('Event Title:', sampleBooking.eventId.title);
      console.log('Event Date:', sampleBooking.eventId.date);
      console.log('Event Date Type:', typeof sampleBooking.eventId.date);
      console.log('Event Time:', sampleBooking.eventId.time);
      console.log('Event Location:', sampleBooking.eventId.location);
    } else {
      console.log('\n❌ Event ID is not populated');
    }

    // Check if userId is populated
    if (sampleBooking.userId && typeof sampleBooking.userId === 'object') {
      console.log('\n✅ User ID is populated:');
      console.log('Username:', sampleBooking.userId.username);
      console.log('Home Number:', sampleBooking.userId.homeNumber);
      console.log('Name:', sampleBooking.userId.name);
    } else {
      console.log('\n❌ User ID is not populated');
    }

    // Display all bookings with dates
    console.log('\n📅 All Bookings with Dates:');
    bookings.forEach((booking, index) => {
      const event = booking.eventId && typeof booking.eventId === 'object' ? booking.eventId : null;
      const user = booking.userId && typeof booking.userId === 'object' ? booking.userId : null;
      
      console.log(`\n${index + 1}. Booking ${booking._id}:`);
      console.log(`   User: ${user ? user.homeNumber : 'N/A'} (${user ? user.username : 'N/A'})`);
      console.log(`   Event: ${event ? event.title : 'N/A'}`);
      console.log(`   Event Date: ${event ? new Date(event.date).toLocaleDateString() : 'N/A'}`);
      console.log(`   Event Time: ${event ? event.time : 'N/A'}`);
      console.log(`   Booked Date: ${new Date(booking.bookedAt).toLocaleDateString()}`);
      console.log(`   Attendees: ${booking.attendees}`);
      console.log(`   Amount: ₹${booking.amount}`);
    });

    // Test date formatting
    console.log('\n🕐 Date Formatting Test:');
    const testDate = new Date();
    console.log('Current Date:', testDate);
    console.log('toLocaleDateString():', testDate.toLocaleDateString());
    console.log('toISOString():', testDate.toISOString());
    console.log('toString():', testDate.toString());

  } catch (error) {
    console.error('❌ Error debugging bookings:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database disconnected');
  }
};

debugBookings();
