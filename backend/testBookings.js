require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Booking = require('./models/Booking');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/society_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testBookings = async () => {
  try {
    console.log('🔍 Testing booking functionality...');

    // Get users and events
    const users = await User.find({ role: 'resident' });
    const events = await Event.find();

    console.log(`📋 Found ${users.length} users and ${events.length} events`);

    if (users.length === 0 || events.length === 0) {
      console.log('❌ Need users and events first. Run createTestUser.js and createTestEvents.js');
      return;
    }

    // Create test bookings
    const bookings = [];
    for (let i = 0; i < 5; i++) {
      const user = users[i % users.length];
      const event = events[i % events.length];
      
      const booking = new Booking({
        userId: user._id,
        eventId: event._id,
        attendees: Math.floor(Math.random() * 3) + 1,
        status: 'confirmed',
        amount: event.isPaid ? (Math.floor(Math.random() * 3) + 1) * event.price : 0,
        paymentStatus: 'completed'
      });
      
      bookings.push(booking);
    }

    await Booking.insertMany(bookings);
    console.log('✅ Created test bookings');

    // Test admin booking fetch
    const allBookings = await Booking.find()
      .populate('userId', 'username homeNumber name')
      .populate('eventId', 'title date location');

    console.log('\n📊 All Bookings:');
    allBookings.forEach(booking => {
      console.log(`- ${booking.userId?.homeNumber} booked ${booking.eventId?.title}: ${booking.attendees} people, ₹${booking.amount}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

testBookings();
