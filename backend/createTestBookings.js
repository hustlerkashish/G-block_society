require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Booking = require('./models/Booking');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/society_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createTestBookings = async () => {
  try {
    console.log('🔄 Creating test bookings...');

    // Get existing users and events
    const users = await User.find({ role: 'resident' }).limit(5);
    const events = await Event.find().limit(3);

    if (users.length === 0) {
      console.log('❌ No resident users found. Please create users first.');
      return;
    }

    if (events.length === 0) {
      console.log('❌ No events found. Please create events first.');
      return;
    }

    console.log(`📋 Found ${users.length} users and ${events.length} events`);

    // Clear existing bookings
    await Booking.deleteMany({});
    console.log('🗑️  Cleared existing bookings');

    const testBookings = [];

    // Create multiple bookings for each event
    for (const event of events) {
      console.log(`📅 Creating bookings for event: ${event.title}`);
      
      // Create bookings from different users
      for (let i = 0; i < Math.min(users.length, 3); i++) {
        const user = users[i];
        
        // Create 1-3 bookings per user per event
        const numBookings = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < numBookings; j++) {
          const attendees = Math.floor(Math.random() * 4) + 1;
          const amount = event.isPaid ? attendees * event.price : 0;
          
          const booking = {
            userId: user._id,
            eventId: event._id,
            attendees: attendees,
            status: 'confirmed',
            specialRequirements: j === 0 ? 'No special requirements' : `Additional booking ${j + 1}`,
            amount: amount,
            paymentStatus: 'completed',
            paymentMethod: 'online',
            bookedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
          };
          
          testBookings.push(booking);
        }
      }
    }

    // Insert all bookings
    const savedBookings = await Booking.insertMany(testBookings);
    console.log(`✅ Created ${savedBookings.length} test bookings`);

    // Update event attendees count
    for (const booking of savedBookings) {
      await Event.findByIdAndUpdate(booking.eventId, {
        $inc: { attendees: booking.attendees }
      });
    }

    // Display summary
    console.log('\n📊 Booking Summary:');
    for (const event of events) {
      const eventBookings = savedBookings.filter(b => b.eventId.toString() === event._id.toString());
      const totalAttendees = eventBookings.reduce((sum, b) => sum + b.attendees, 0);
      const totalRevenue = eventBookings.reduce((sum, b) => sum + b.amount, 0);
      const uniqueUsers = new Set(eventBookings.map(b => b.userId.toString())).size;
      
      console.log(`\n🎉 ${event.title}:`);
      console.log(`   📅 Date: ${new Date(event.date).toLocaleDateString()}`);
      console.log(`   👥 Total Bookings: ${eventBookings.length}`);
      console.log(`   🏠 Unique Users: ${uniqueUsers}`);
      console.log(`   👤 Total Attendees: ${totalAttendees}`);
      console.log(`   💰 Total Revenue: ₹${totalRevenue}`);
    }

    // Show user booking details
    console.log('\n👥 User Booking Details:');
    for (const user of users) {
      const userBookings = savedBookings.filter(b => b.userId.toString() === user._id.toString());
      if (userBookings.length > 0) {
        console.log(`\n🏠 ${user.homeNumber} (${user.username}):`);
        console.log(`   📊 Total Bookings: ${userBookings.length}`);
        console.log(`   👤 Total Attendees: ${userBookings.reduce((sum, b) => sum + b.attendees, 0)}`);
        console.log(`   💰 Total Spent: ₹${userBookings.reduce((sum, b) => sum + b.amount, 0)}`);
        
        for (const booking of userBookings) {
          const event = events.find(e => e._id.toString() === booking.eventId.toString());
          console.log(`     - ${event?.title}: ${booking.attendees} attendees, ₹${booking.amount}`);
        }
      }
    }

    console.log('\n✅ Test bookings created successfully!');
    console.log('💡 You can now test the admin analytics dashboard');

  } catch (error) {
    console.error('❌ Error creating test bookings:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database disconnected');
  }
};

createTestBookings();
