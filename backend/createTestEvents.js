require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Booking = require('./models/Booking');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/society_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createTestData = async () => {
  try {
    // Clear existing test data
    await Event.deleteMany({});
    await Booking.deleteMany({});

    // Get some users for bookings
    const users = await User.find({ role: 'resident' }).limit(5);
    
    if (users.length === 0) {
      console.log('No resident users found. Please create some users first.');
      return;
    }

    // Create test events
    const events = [
      {
        title: 'Diwali Celebration',
        date: new Date('2024-12-15'),
        time: '18:00',
        location: 'Society Garden',
        capacity: 100,
        attendees: 0,
        status: 'upcoming',
        isPaid: true,
        price: 500,
        description: 'Grand Diwali celebration with cultural programs, dinner, and fireworks display. All residents are welcome to join this festive celebration.',
        createdBy: users[0]._id,
      },
      {
        title: 'Annual General Meeting',
        date: new Date('2024-12-20'),
        time: '19:00',
        location: 'Community Hall',
        capacity: 50,
        attendees: 0,
        status: 'upcoming',
        isPaid: false,
        price: 0,
        description: 'Annual society meeting to discuss important matters, budget review, and upcoming projects. All residents must attend.',
        createdBy: users[0]._id,
      },
      {
        title: 'New Year Party',
        date: new Date('2024-12-31'),
        time: '20:00',
        location: 'Society Clubhouse',
        capacity: 80,
        attendees: 0,
        status: 'upcoming',
        isPaid: true,
        price: 800,
        description: 'Ring in the new year with your neighbors! Live music, buffet dinner, and countdown celebration.',
        createdBy: users[0]._id,
      },
      {
        title: 'Yoga Classes',
        date: new Date('2024-12-10'),
        time: '07:00',
        location: 'Society Park',
        capacity: 30,
        attendees: 0,
        status: 'upcoming',
        isPaid: true,
        price: 200,
        description: 'Morning yoga classes for health and wellness. Suitable for all age groups.',
        createdBy: users[0]._id,
      },
      {
        title: 'Children\'s Day Celebration',
        date: new Date('2024-11-14'),
        time: '16:00',
        location: 'Society Playground',
        capacity: 60,
        attendees: 0,
        status: 'upcoming',
        isPaid: false,
        price: 0,
        description: 'Special celebration for children with games, activities, and prizes.',
        createdBy: users[0]._id,
      }
    ];

    // Save events
    const savedEvents = await Event.insertMany(events);
    console.log(`Created ${savedEvents.length} events`);

    // Create test bookings
    const bookings = [];
    
    // Bookings for Diwali Celebration
    bookings.push({
      userId: users[0]._id,
      eventId: savedEvents[0]._id,
      attendees: 3,
      specialRequirements: 'Vegetarian food preferred',
      amount: 1500,
      status: 'confirmed',
      paymentStatus: 'completed',
      paymentMethod: 'online',
    });

    bookings.push({
      userId: users[1]?._id || users[0]._id,
      eventId: savedEvents[0]._id,
      attendees: 2,
      specialRequirements: '',
      amount: 1000,
      status: 'confirmed',
      paymentStatus: 'completed',
      paymentMethod: 'online',
    });

    // Bookings for Annual General Meeting
    bookings.push({
      userId: users[0]._id,
      eventId: savedEvents[1]._id,
      attendees: 1,
      specialRequirements: '',
      amount: 0,
      status: 'confirmed',
      paymentStatus: 'completed',
      paymentMethod: 'free',
    });

    bookings.push({
      userId: users[1]?._id || users[0]._id,
      eventId: savedEvents[1]._id,
      attendees: 1,
      specialRequirements: '',
      amount: 0,
      status: 'confirmed',
      paymentStatus: 'completed',
      paymentMethod: 'free',
    });

    // Bookings for New Year Party
    bookings.push({
      userId: users[0]._id,
      eventId: savedEvents[2]._id,
      attendees: 4,
      specialRequirements: 'Table near the stage',
      amount: 3200,
      status: 'confirmed',
      paymentStatus: 'completed',
      paymentMethod: 'online',
    });

    // Bookings for Yoga Classes
    bookings.push({
      userId: users[1]?._id || users[0]._id,
      eventId: savedEvents[3]._id,
      attendees: 1,
      specialRequirements: 'Beginner level',
      amount: 200,
      status: 'confirmed',
      paymentStatus: 'completed',
      paymentMethod: 'online',
    });

    // Bookings for Children's Day
    bookings.push({
      userId: users[0]._id,
      eventId: savedEvents[4]._id,
      attendees: 2,
      specialRequirements: 'Children aged 8 and 12',
      amount: 0,
      status: 'confirmed',
      paymentStatus: 'completed',
      paymentMethod: 'free',
    });

    // Save bookings
    const savedBookings = await Booking.insertMany(bookings);
    console.log(`Created ${savedBookings.length} bookings`);

    // Update event attendee counts
    for (const booking of savedBookings) {
      await Event.findByIdAndUpdate(booking.eventId, {
        $inc: { attendees: booking.attendees }
      });
    }

    console.log('Test data created successfully!');
    console.log('\nSummary:');
    console.log(`- Events created: ${savedEvents.length}`);
    console.log(`- Bookings created: ${savedBookings.length}`);
    console.log(`- Total revenue: ₹${savedBookings.reduce((sum, b) => sum + b.amount, 0)}`);
    console.log(`- Participating houses: ${new Set(savedBookings.map(b => b.userId.toString())).size}`);

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestData(); 