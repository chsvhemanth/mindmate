# MindMate - System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Actors](#actors)
3. [Actor Capabilities](#actor-capabilities)
4. [Workflows](#workflows)
5. [System Architecture](#system-architecture)
6. [API Endpoints](#api-endpoints)
7. [Data Models](#data-models)

---

## Overview

MindMate is a comprehensive mental health and wellness platform that provides:
- **AI-Powered Chat Therapy**: 24/7 anonymous chat support with empathetic AI
- **Video Chat Sessions**: Voice-based therapy sessions with real-time emotion analysis
- **Community Events**: Join or host wellness events (meditation, support groups, workshops, social gatherings)
- **Therapist Finder**: Find nearby therapists (within 20km) or book virtual sessions
- **Emotion Tracking**: Monitor emotional patterns and wellness metrics
- **Personalized Dashboard**: Track your wellness journey with insights and progress

---

## Actors

### 1. **User (End User/Patient)**
The primary actor who uses MindMate to seek mental health support and wellness resources.

**Characteristics:**
- Can be anonymous or authenticated
- Seeks mental health support, therapy, or wellness resources
- May have varying levels of engagement (casual to regular users)
- Can participate in community events
- Can book therapy sessions

### 2. **Therapist**
Licensed mental health professionals who provide therapy services.

**Characteristics:**
- Registered in the system with credentials and specializations
- Have location data (coordinates) for geospatial matching
- Offer in-home or virtual therapy sessions
- Have ratings, reviews, and availability status
- Can be found within 20km radius or available for virtual calls

### 3. **Event Host**
Users who create and manage community events.

**Characteristics:**
- Can be any authenticated user
- Creates events with details (title, description, location, date, time, category)
- Manages event participants and approval requests
- Can update or delete their events

### 4. **System/Admin**
The backend system that manages:
- AI responses via Groq API
- Database operations
- Authentication and authorization
- Geospatial queries for therapist matching
- Emotion analysis

---

## Actor Capabilities

### User Capabilities

#### Authentication & Profile
- **Register Account**: Create account with email/password or Google OAuth
- **Login/Logout**: Authenticate to access personalized features
- **Complete Onboarding**: Fill out "Know Your Mind" (KYM) questionnaire
- **View Dashboard**: Access personalized wellness dashboard
- **Update Profile**: Modify personal information

#### Chat Features
- **Text Chat**: Have anonymous or authenticated conversations with AI therapist
- **Emotion Analysis**: Automatic emotion detection from messages
- **Chat History**: View and manage conversation history
- **Multiple Chat Sessions**: Create and manage multiple chat threads

#### Video Chat Features
- **Voice Therapy Session**: Speak with AI therapist using speech recognition
- **Real-time Emotion Analysis**: Voice-based emotion detection
- **Speech-to-Text**: Automatic transcription of speech
- **Text-to-Speech**: AI responses spoken aloud
- **Session Management**: Start/stop listening, end sessions

#### Community Features
- **Browse Events**: View all available community events
- **Filter Events**: Filter by city, category, or search query
- **Join Events**: Request to join events (auto-approve or pending approval)
- **Host Events**: Create new community events
- **View Event Details**: See event information, attendees, and status

#### Therapist Booking
- **Find Nearby Therapists**: Search therapists within 20km radius
- **Virtual Therapy Options**: View therapists available for virtual calls when none nearby
- **View Therapist Profiles**: See ratings, specializations, experience, rates
- **Book Sessions**: Request in-home or virtual therapy sessions
- **Contact Therapists**: Call or email therapists directly

#### Wellness Tracking
- **Emotion Recording**: Log emotions with intensity and notes
- **View Emotion History**: See past emotional states
- **Emotion Statistics**: View trends and patterns
- **Health Metrics**: Track sleep, exercise, stress levels
- **Activity Tracking**: Monitor wellness activities

### Therapist Capabilities

#### Profile Management
- **Create Profile**: Register with credentials, specializations, location
- **Update Profile**: Modify information, availability, rates
- **Set Availability**: Mark as available/unavailable
- **Manage Specializations**: Update areas of expertise

#### Service Delivery
- **Receive Booking Requests**: Get notified of session requests
- **Conduct Sessions**: Provide in-home or virtual therapy
- **Manage Schedule**: Set availability and time slots

### Event Host Capabilities

#### Event Management
- **Create Events**: Set up new community events with all details
- **Manage Participants**: Approve or reject join requests
- **Update Events**: Modify event details, date, time, location
- **Delete Events**: Remove events they created
- **View Attendees**: See list of approved participants

### System Capabilities

#### AI & Processing
- **Generate Responses**: Use Groq API for empathetic AI responses
- **Emotion Analysis**: Analyze text and voice for emotional state
- **Context Management**: Maintain conversation history for better responses
- **Prompt Matching**: Match user queries to appropriate therapeutic responses

#### Data Management
- **Geospatial Queries**: Find therapists within radius using MongoDB geospatial indexes
- **User Authentication**: JWT token management, Google OAuth
- **Data Persistence**: Store chats, emotions, events, therapists, users
- **Real-time Processing**: Handle speech recognition and synthesis

---

## Workflows

### 1. User Registration & Onboarding Workflow

```
1. User visits homepage
2. Clicks "Sign In" or "Get Started"
3. Chooses authentication method:
   a. Email/Password Registration
      - Enters email, password, optional name
      - System validates and creates account
      - Receives JWT token
   b. Google OAuth
      - Redirects to Google
      - Authorizes access
      - System creates/updates account
      - Receives JWT token
4. Redirected to Onboarding (if first time)
5. Completes "Know Your Mind" (KYM) questionnaire:
   - Step 1: Personal Info (name, age, occupation)
   - Step 2: Lifestyle (sleep, stress, exercise)
   - Step 3: Goals & Preferences
   - Step 4: Medical Info & Emergency Contact
6. Data saved to localStorage and backend
7. Redirected to Dashboard
```

### 2. Text Chat Workflow

```
1. User navigates to Chat page
2. System displays welcome message
3. User types message
4. On send:
   a. System analyzes emotion from text
   b. Prepares conversation history (last 10 messages)
   c. Sends to backend API with emotion context
   d. Backend calls Groq API with:
      - User message
      - Conversation history
      - Detected emotion
      - System prompt for therapist-like responses
   e. AI generates empathetic response
   f. Response displayed to user
   g. Emotion indicator updated
5. Conversation continues with context maintained
6. User can:
   - Create new chat session
   - View chat history
   - Navigate to video chat
   - Book therapist session
```

### 3. Video Chat (Voice Therapy) Workflow

```
1. User navigates to Video Chat page
2. System requests microphone permission
3. User clicks microphone button to start
4. Speech recognition initialized:
   a. Continuous listening enabled
   b. Interim results shown
   c. Final transcripts processed
5. When user speaks:
   a. Speech transcribed to text
   b. Text analyzed for emotion
   c. AI response generated (same as text chat)
   d. Response converted to speech
   e. AI "speaks" response
   f. Recognition pauses during AI speech
   g. Recognition resumes after AI finishes
6. User can:
   - Toggle microphone on/off
   - End session (returns to chat)
   - Book in-home therapy session
7. Session ends when user navigates away
```

### 4. Find & Book Therapist Workflow

```
1. User clicks "Book In-Home Therapy Session" (from Chat or Video Chat)
2. System requests geolocation permission
3. System searches for therapists:
   a. Primary: Find therapists within 20km radius
      - Uses MongoDB geospatial query ($near)
      - Sorts by distance
      - Limits to 50 results
   b. Fallback: If none found within 20km
      - Fetches all available therapists (limit 10)
      - Marks as "Virtual Call Available"
4. Dialog displays:
   a. If nearby found: Shows therapists with distance badges
   b. If virtual: Shows blue banner "Connect Virtually with Therapists"
5. User views therapist list (5 at a time):
   - Name, rating, reviews
   - Specializations (badges)
   - Location, experience, rate
   - Distance (if nearby) or "Virtual Call Available" badge
   - Bio and qualifications
6. User can:
   - Click "Load More" to see next 5 therapists
   - Click "Book Session" / "Book Virtual Session"
   - Call therapist (opens phone dialer)
   - Email therapist (opens email client)
7. Booking confirmation toast shown
8. Therapist receives booking request (future implementation)
```

### 5. Community Events Workflow

#### Browse & Join Events
```
1. User navigates to Community page
2. System fetches all future events
3. Events displayed in grid:
   - Category icons and badges
   - Title, description, location
   - Date, time, attendees count
   - Join button (or status if already joined)
4. User can:
   - Search events by keyword
   - Filter by city (dropdown)
   - View event details
   - Join event (if authenticated)
5. On join:
   a. If requires approval: Status = "Pending"
   b. If no approval needed: Status = "Approved", added to attendees
   c. Event attendee count updates
   d. Success message shown
6. User can view their joined events
```

#### Host Event Workflow
```
1. User clicks "Host an Event" button
2. Dialog opens with form
3. User fills out:
   - Event title (required)
   - Description (required)
   - Location address (required)
   - City (required)
   - Date (required, must be future)
   - Time (required)
   - Category: meditation/support/workshop/social
   - Max attendees (required, min 1)
   - Requires approval (checkbox)
4. User submits form
5. System validates:
   - All required fields
   - Date is in future
   - Max attendees >= 1
6. Event created with:
   - Host ID (current user)
   - All provided details
   - Default: requiresApproval = false
7. Event saved to database
8. Success message shown
9. Events list refreshes
10. New event appears in community feed
```

#### Event Management (Host)
```
1. Host views their created events
2. Host can see:
   - Pending join requests (if approval required)
   - Current attendees
   - Event details
3. Host actions:
   - Approve join request → User added to attendees
   - Reject join request → User removed from pending
   - Update event details
   - Delete event
4. Changes reflected immediately
```

### 6. Emotion Tracking Workflow

```
1. User navigates to Dashboard
2. System displays:
   - Current emotion indicator
   - Emotion history chart
   - Recent emotions list
3. User can manually record emotion:
   a. Click "Record Emotion"
   b. Select emotion type
   c. Set intensity (1-10)
   d. Add optional notes
   e. Save
4. Emotion saved to database with:
   - User ID
   - Emotion type
   - Intensity
   - Notes
   - Timestamp
5. Dashboard updates:
   - Chart reflects new data point
   - Statistics recalculated
   - Trends identified
6. System can auto-record emotions from:
   - Chat messages (analyzed)
   - Video chat sessions (voice analyzed)
```

### 7. Dashboard & Wellness Tracking Workflow

```
1. User logs in and navigates to Dashboard
2. System loads:
   - User profile data
   - KYM completion status
   - Emotion history
   - Health metrics
   - Activity tracking data
3. Dashboard displays:
   a. Welcome section with KYM status
   b. Emotion tracking:
      - Current emotion indicator
      - Emotion history chart (line/bar chart)
      - Recent emotions list
   c. Health metrics:
      - Sleep hours
      - Exercise frequency
      - Stress level
   d. Activity tracker:
      - Wellness activities completed
      - Progress indicators
   e. Quick actions:
      - Continue Chat
      - View Community
      - Record Emotion
4. User can:
   - View detailed emotion statistics
   - Update health metrics
   - Track activities
   - Navigate to other pages
   - Retake KYM questionnaire
```

### 8. Authentication Workflow

#### Email/Password Login
```
1. User clicks "Sign In"
2. Enters email and password
3. System validates credentials
4. Backend:
   a. Finds user by email
   b. Compares password hash (bcrypt)
   c. Generates JWT token
   d. Returns token + user data
5. Frontend:
   a. Stores token in localStorage
   b. Stores user data in context
   c. Redirects to Dashboard or Chat
```

#### Google OAuth Login
```
1. User clicks "Sign in with Google"
2. Redirects to Google OAuth consent screen
3. User authorizes MindMate
4. Google returns authorization code
5. Frontend sends code to backend
6. Backend:
   a. Exchanges code for Google ID token
   b. Verifies token with Google
   c. Extracts user info (email, name, picture)
   d. Finds or creates user account
   e. Generates JWT token
   f. Returns token + user data
7. Frontend stores token and redirects
```

#### Logout
```
1. User clicks logout
2. System:
   a. Removes JWT token from localStorage
   b. Clears user context
   c. Redirects to homepage
```

### 9. Therapist Seed & Management Workflow

#### Seed Therapists (Admin/System)
```
1. Run seed script: npm run seed:therapists
2. Script:
   a. Connects to MongoDB
   b. Checks for existing therapists
   c. Deletes existing (optional) or uses existing user as host
   d. Creates 20 sample therapists with:
      - Name, email, phone
      - Specializations (anxiety, depression, trauma, etc.)
      - Location with coordinates (GeoJSON Point format)
      - Experience, rate, bio
      - Qualifications, languages
      - Ratings, review counts
   e. Saves to database
3. Therapists available for:
   - Geospatial queries (nearby search)
   - Virtual booking
   - Profile viewing
```

### 10. Event Seed Workflow

#### Seed Events (Admin/System)
```
1. Run seed script: npm run seed:events
2. Script:
   a. Connects to MongoDB
   b. Gets or creates host user
   c. Creates 15 sample events:
      - Various categories (meditation, support, workshop, social)
      - Different cities (NY, LA, Chicago, Seattle, etc.)
      - Future dates (5-21 days from now)
      - Different max attendees
      - Some require approval, some don't
   d. Saves to database
3. Events appear in community feed
```

---

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: React Router
- **State Management**: React Context API (AuthContext)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **HTTP Client**: Fetch API
- **Real-time**: Web Speech API (recognition & synthesis)

### Backend Architecture
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens, Google OAuth
- **AI Integration**: Groq API (LLM)
- **Geospatial**: MongoDB 2dsphere indexes
- **API Style**: RESTful

### Key Technologies
- **Speech Recognition**: Web Speech API (webkitSpeechRecognition)
- **Speech Synthesis**: Web Speech API (speechSynthesis)
- **Emotion Analysis**: Text-based sentiment analysis
- **Geolocation**: Browser Geolocation API
- **Maps**: Geospatial queries (MongoDB)

---

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login with email/password
- `POST /api/auth/google` - Google OAuth login
- `GET /api/users/:userId` - Get user profile
- `PATCH /api/users/:userId` - Update user profile

### Chat
- `POST /api/chats` - Create new chat session
- `GET /api/chats/user/:userId` - Get user's chat sessions
- `GET /api/chats/:chatId` - Get specific chat
- `POST /api/chats/:chatId/messages` - Add message to chat
- `POST /api/chats/ai/response` - Get AI response (Groq)
- `DELETE /api/chats/:chatId` - Delete chat

### Emotions
- `POST /api/emotions` - Record emotion
- `GET /api/emotions/user/:userId` - Get emotion history
- `GET /api/emotions/user/:userId/stats` - Get emotion statistics
- `DELETE /api/emotions/:emotionId` - Delete emotion

### Events
- `GET /api/events` - Get all events (with filters: city, category, date)
- `GET /api/events/:eventId` - Get specific event
- `POST /api/events` - Create event (requires auth)
- `POST /api/events/:eventId/join` - Join event
- `PATCH /api/events/:eventId/approve/:userId` - Approve join request (host only)
- `PATCH /api/events/:eventId/reject/:userId` - Reject join request (host only)
- `GET /api/events/user/:userId` - Get user's events
- `PATCH /api/events/:eventId` - Update event (host only)
- `DELETE /api/events/:eventId` - Delete event (host only)

### Therapists
- `GET /api/therapists` - Get all therapists (with filters: city, specialization)
- `GET /api/therapists/nearby` - Find nearby therapists (latitude, longitude, maxDistance)
- `GET /api/therapists/:therapistId` - Get specific therapist
- `POST /api/therapists` - Create therapist (admin)
- `PATCH /api/therapists/:therapistId` - Update therapist
- `DELETE /api/therapists/:therapistId` - Delete therapist

### Health
- `GET /api/health` - Health check endpoint

---

## Data Models

### User
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required if not Google),
  username: String (unique, optional),
  googleId: String (unique, optional),
  firstName: String,
  lastName: String,
  picture: String (URL),
  authProvider: String ('local' | 'google'),
  createdAt: Date,
  updatedAt: Date
}
```

### Chat
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  messages: [{
    content: String,
    role: String ('user' | 'assistant'),
    emotion: String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Emotion
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  emotion: String (required),
  intensity: Number (1-10),
  notes: String,
  context: String,
  createdAt: Date
}
```

### Event
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  location: String (required),
  city: String (required),
  date: Date (required),
  time: String (required),
  maxAttendees: Number (required, min: 1),
  category: String ('meditation' | 'support' | 'workshop' | 'social'),
  hostId: ObjectId (ref: User, required),
  requiresApproval: Boolean (default: false),
  participants: [{
    userId: ObjectId (ref: User),
    status: String ('pending' | 'approved' | 'rejected'),
    requestedAt: Date,
    approvedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Therapist
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, required),
  phone: String (required),
  specialization: [String] (required),
  experience: Number (required, min: 0),
  location: {
    address: String (required),
    city: String (required),
    state: String,
    zipCode: String,
    coordinates: {
      type: String ('Point'),
      coordinates: [Number, Number] // [longitude, latitude]
    }
  },
  rate: Number (required, min: 0),
  bio: String,
  qualifications: [String],
  languages: [String] (default: ['English']),
  isAvailable: Boolean (default: true),
  rating: Number (0-5, default: 0),
  reviewCount: Number (default: 0),
  availability: Map,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Key Features Summary

### Core Features
1. **AI Chat Therapy** - 24/7 empathetic AI conversations
2. **Video Chat** - Voice-based therapy with real-time emotion analysis
3. **Therapist Finder** - Geospatial search (20km) or virtual options
4. **Community Events** - Join or host wellness events
5. **Emotion Tracking** - Monitor and analyze emotional patterns
6. **Wellness Dashboard** - Personalized insights and progress tracking

### Technical Features
- JWT authentication with Google OAuth
- Real-time speech recognition and synthesis
- Geospatial queries for location-based matching
- Emotion-aware AI responses
- Responsive design (mobile-friendly)
- Secure API endpoints
- MongoDB with geospatial indexes

---

## Future Enhancements

### Planned Features
- Real therapist booking system with calendar integration
- Video call integration for virtual sessions
- Push notifications for events and bookings
- Advanced analytics and insights
- Group therapy sessions
- Medication reminders
- Crisis intervention protocols
- Therapist reviews and ratings system
- Payment integration for sessions
- Mobile app (React Native)

---

## Security & Privacy

### Security Measures
- JWT token-based authentication
- Password hashing with bcrypt
- HTTPS for all API calls
- CORS protection
- Input validation and sanitization
- Protected routes (authentication required)

### Privacy Features
- Anonymous chat option
- User data encryption
- Secure session management
- GDPR-compliant data handling
- User can delete their data

---

## Deployment

### Environment Variables

#### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

#### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindmate
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GROQ_API_KEY=your_groq_api_key
CORS_ORIGIN=http://localhost:8080,http://localhost:5173
NODE_ENV=development
```

### Running the Application

#### Backend
```bash
cd backend
npm install
npm run seed:therapists  # Seed therapists
npm run seed:events      # Seed events
npm run dev              # Start development server
```

#### Frontend
```bash
cd frontend
npm install
npm run dev              # Start development server
```

---

## Support & Maintenance

### Database Seeding
- Therapists: `npm run seed:therapists`
- Events: `npm run seed:events`

### Monitoring
- Health check: `GET /api/health`
- Error logging: Console and error tracking
- Performance: Monitor API response times

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintained By**: MindMate Development Team

