import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../src/models/Event.js';
import User from '../src/models/User.js';
import connectDB from '../src/config/database.js';

dotenv.config();

// Sample event data
const sampleEvents = [
  {
    title: "Morning Meditation & Mindfulness",
    description: "Start your day with a peaceful meditation session. We'll practice breathing techniques, guided meditation, and share mindfulness tips. Perfect for beginners and experienced practitioners alike. Bring a yoga mat or cushion if you have one.",
    location: "Central Park - Great Lawn",
    city: "New York",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    time: "08:00",
    maxAttendees: 30,
    category: "meditation",
    requiresApproval: false
  },
  {
    title: "Anxiety Support Group Meeting",
    description: "A safe space to share experiences, learn coping strategies, and connect with others who understand. This is a peer-led support group focused on anxiety management. All are welcome - no judgment, just support.",
    location: "Community Center - Room 201",
    city: "Los Angeles",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    time: "18:30",
    maxAttendees: 15,
    category: "support",
    requiresApproval: true
  },
  {
    title: "Stress Management Workshop",
    description: "Learn practical techniques to manage stress in your daily life. We'll cover time management, relaxation techniques, and building resilience. Interactive session with hands-on activities and take-home resources.",
    location: "Wellness Center - Main Hall",
    city: "Chicago",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    time: "14:00",
    maxAttendees: 25,
    category: "workshop",
    requiresApproval: false
  },
  {
    title: "Coffee & Conversation - Mental Health Chat",
    description: "A casual social gathering for people to connect, share stories, and build community. No agenda, just good conversation and support. Coffee and light snacks provided. Come as you are!",
    location: "The Cozy Corner Cafe",
    city: "Seattle",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    time: "10:00",
    maxAttendees: 20,
    category: "social",
    requiresApproval: false
  },
  {
    title: "Sunset Yoga & Meditation",
    description: "Join us for a gentle yoga flow followed by a guided meditation session as the sun sets. Suitable for all levels. We'll focus on relaxation, stretching, and inner peace. Bring your own mat!",
    location: "Beach Park - Sunset Point",
    city: "San Francisco",
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    time: "18:00",
    maxAttendees: 35,
    category: "meditation",
    requiresApproval: false
  },
  {
    title: "Depression Support Circle",
    description: "A compassionate support group for those dealing with depression. Share your journey, listen to others, and find hope together. Facilitated by trained peer supporters. Confidential and judgment-free.",
    location: "Mental Health Center - Room 3",
    city: "Boston",
    date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
    time: "19:00",
    maxAttendees: 12,
    category: "support",
    requiresApproval: true
  },
  {
    title: "Building Healthy Relationships Workshop",
    description: "Explore communication skills, boundary setting, and emotional intelligence in relationships. Interactive exercises and group discussions. Great for anyone looking to improve their interpersonal connections.",
    location: "Community Library - Conference Room",
    city: "Austin",
    date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), // 16 days from now
    time: "15:30",
    maxAttendees: 20,
    category: "workshop",
    requiresApproval: false
  },
  {
    title: "Mindful Walking & Nature Connection",
    description: "Combine gentle walking with mindfulness practices in nature. We'll walk at a relaxed pace, practice mindful observation, and end with a short meditation. Great for reducing stress and connecting with nature.",
    location: "Riverside Trail - Starting Point",
    city: "Portland",
    date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
    time: "09:00",
    maxAttendees: 25,
    category: "meditation",
    requiresApproval: false
  },
  {
    title: "Trauma Recovery Support Group",
    description: "A specialized support group for trauma survivors. Safe, confidential space to share and heal. Facilitated by trained trauma-informed peer supporters. Please note: This group requires approval to join.",
    location: "Wellness Center - Private Room",
    city: "Denver",
    date: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000), // 13 days from now
    time: "17:00",
    maxAttendees: 10,
    category: "support",
    requiresApproval: true
  },
  {
    title: "Game Night & Social Mixer",
    description: "Fun evening of board games, card games, and socializing! A great way to meet new people in a relaxed, friendly environment. Games provided, but feel free to bring your favorites. Snacks and drinks available.",
    location: "Game Cafe Downtown",
    city: "Miami",
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    time: "19:30",
    maxAttendees: 30,
    category: "social",
    requiresApproval: false
  },
  {
    title: "Mindfulness for Beginners",
    description: "New to mindfulness? This workshop is perfect for you! Learn the basics of mindfulness practice, simple meditation techniques, and how to incorporate mindfulness into your daily routine. No experience needed.",
    location: "Yoga Studio - Main Room",
    city: "Phoenix",
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    time: "11:00",
    maxAttendees: 20,
    category: "workshop",
    requiresApproval: false
  },
  {
    title: "Evening Gratitude Circle",
    description: "End your day on a positive note with a gratitude practice. We'll share what we're grateful for, practice gratitude meditation, and set positive intentions. A peaceful way to close the day.",
    location: "Peaceful Garden - Meditation Area",
    city: "San Diego",
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    time: "19:00",
    maxAttendees: 18,
    category: "meditation",
    requiresApproval: false
  },
  {
    title: "LGBTQ+ Mental Health Support",
    description: "A welcoming support group specifically for LGBTQ+ individuals. Share experiences, find community, and support each other's mental health journeys. Allies welcome too! Safe and inclusive space.",
    location: "Community Center - Rainbow Room",
    city: "New York",
    date: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000), // 17 days from now
    time: "18:00",
    maxAttendees: 15,
    category: "support",
    requiresApproval: false
  },
  {
    title: "Art Therapy & Creative Expression",
    description: "Express yourself through art! No artistic skills required. We'll use various art materials to explore emotions, reduce stress, and have fun. All materials provided. Just bring yourself!",
    location: "Art Studio - Creative Space",
    city: "Los Angeles",
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    time: "16:00",
    maxAttendees: 15,
    category: "workshop",
    requiresApproval: false
  },
  {
    title: "Weekend Brunch & Wellness Chat",
    description: "Relaxed weekend brunch gathering focused on wellness and connection. Enjoy good food, great conversation, and meet like-minded people. Brunch included! Come hungry for food and community.",
    location: "Sunny Side Cafe",
    city: "Seattle",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now (weekend)
    time: "11:30",
    maxAttendees: 25,
    category: "social",
    requiresApproval: false
  }
];

async function seedEvents() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if events already exist
    const existingEvents = await Event.countDocuments();
    if (existingEvents > 0) {
      console.log(`Found ${existingEvents} existing events.`);
      console.log('Deleting existing events and creating new ones...');
      await Event.deleteMany({});
    }

    // Get or create a default host user
    let hostUser = await User.findOne({ email: 'host@mindmate.com' });
    
    if (!hostUser) {
      // Try to get any existing user
      hostUser = await User.findOne();
      
      if (!hostUser) {
        console.log('No users found. Please create a user first, or the script will use the first available user.');
        console.log('Note: Events need a host user. Make sure you have at least one user in the database.');
        process.exit(1);
      } else {
        console.log(`Using existing user: ${hostUser.email} as event host.`);
      }
    } else {
      console.log(`Using host user: ${hostUser.email}`);
    }

    // Create events
    const eventsToCreate = sampleEvents.map(eventData => ({
      ...eventData,
      hostId: hostUser._id
    }));

    const createdEvents = await Event.insertMany(eventsToCreate);
    console.log(`✅ Successfully created ${createdEvents.length} events!`);

    // Display summary
    const categoryCounts = {};
    createdEvents.forEach(event => {
      categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1;
    });

    console.log('\n📊 Event Summary:');
    console.log(`   Meditation: ${categoryCounts.meditation || 0}`);
    console.log(`   Support: ${categoryCounts.support || 0}`);
    console.log(`   Workshop: ${categoryCounts.workshop || 0}`);
    console.log(`   Social: ${categoryCounts.social || 0}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
}

// Run the seed function
seedEvents();

