# MindMate

## Problem statement

Mental health support is often inaccessible, expensive, or stigmatized, leaving many individuals struggling to find immediate, affordable, and personalized care. MindMate aims to bridge this gap by providing a comprehensive and accessible platform for mental wellness that combines AI-powered support, community engagement, and professional therapist connections.

## Users & context

**Users:** Individuals seeking mental health support, therapy, community engagement, and wellness tracking. This includes those experiencing anxiety, depression, trauma, stress, or simply looking for self-improvement and community connection. Users range from those needing immediate emotional support to those seeking long-term therapy solutions.

**Context:** MindMate operates as a digital platform offering diverse mental health resources. It provides a safe and private space for users to engage with AI-powered chat, connect with therapists, participate in community events, and track their emotional well-being, all designed to complement or provide alternatives to traditional mental healthcare. The platform is accessible 24/7, stigma-free, and designed to be user-friendly for people at various stages of their mental health journey.

## Solution overview

MindMate is a full-stack mental health and wellness platform built with a React/TypeScript frontend and a Node.js/Express backend, utilizing MongoDB for data storage. It offers:

- **AI-Powered Chat Therapy:** 24/7 anonymous chat support with an empathetic AI powered by Groq's Llama 3.1 70B model, providing therapist-like responses with emotion awareness and conversation context.

- **Video Chat Sessions:** Voice-based therapy sessions with real-time speech recognition, emotion analysis, and text-to-speech responses, creating an immersive therapeutic experience.

- **Community Events:** Users can browse, join, or host wellness events including meditation sessions, support groups, workshops, and social gatherings. Events support filtering by location, category, and search queries.

- **Therapist Finder:** Locate nearby therapists within a 20km radius using geospatial queries, or book virtual sessions if no local options are available. Features include therapist profiles with ratings, specializations, experience, and contact information.

- **Emotion Tracking:** Tools to monitor emotional patterns and wellness metrics over time, with visual charts, statistics, and historical data to help users understand their emotional journey.

- **Personalized Dashboard:** A central hub for users to track their wellness journey, view insights, monitor progress, complete onboarding questionnaires, and access quick actions to key features.

## Setup & run (steps)

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB (local instance or cloud service like MongoDB Atlas)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following environment variables:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/mindmate
   # For MongoDB Atlas (cloud), use:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindmate?retryWrites=true&w=majority

   # JWT Secret (change this to a random string in production)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # CORS Origins (comma-separated for multiple origins)
   CORS_ORIGIN=http://localhost:5173,http://localhost:8080

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

   # Groq API Configuration
   GROQ_API_KEY=your-groq-api-key
   ```

4. **Get API Keys:**
   - **Groq API Key:** Sign up at [Groq Console](https://console.groq.com/) and create an API key
   - **Google OAuth:** Create credentials at [Google Cloud Console](https://console.cloud.google.com/)
     - Enable Google Identity Services API
     - Create OAuth 2.0 Client ID (Web application)
     - Add authorized JavaScript origins: `http://localhost:5173`, `http://localhost:8080`, `http://localhost:5000`
     - Add authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`

5. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   (For production, use `npm start`)

6. **Seed Sample Data (Optional but Recommended):**
   To populate the database with sample events and therapists:
   ```bash
   npm run seed:events
   npm run seed:therapists
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend` directory with the backend URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```
   (Use the same Google Client ID as in the backend `.env` file)

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

The application should now be running, typically accessible at `http://localhost:8080` or `http://localhost:5173` (depending on your Vite configuration).

## Models & data (sources, licenses)

**Data Models:** The application uses Mongoose schemas for MongoDB to define data structures for:
- **User:** User authentication and profile information (email, password hash, Google OAuth data, profile details)
- **Chat:** Stores chat interactions and conversation history for AI therapy sessions
- **Emotion:** Records user emotion data for tracking (emotion type, intensity, notes, timestamps)
- **Event:** Details for community events (title, description, location, city, date, time, host, attendees, category, approval requirements)
- **Therapist:** Professional profiles for therapists (name, email, phone, specialization, location with GeoJSON coordinates, experience, rates, bio, qualifications, languages, ratings, availability)

**Data Sources:**
- **User-generated content:** Chat messages, event hosting details, emotion entries, user profiles
- **Seeded data:** Initial events and therapist profiles from `backend/scripts/seedEvents.js` and `backend/scripts/seedTherapists.js`
- **External APIs:**
  - **Groq API:** AI chat responses using Llama 3.1 70B model (therapist-like, empathetic responses)
  - **Google OAuth API:** User authentication via Google Sign-In
  - **Web Speech API:** Browser-based speech recognition and synthesis for video chat

**Licenses:**
- Application code: Proprietary
- Third-party libraries and frameworks: Respective open-source licenses (e.g., MIT, Apache 2.0)
  - React, Express.js, MongoDB, Mongoose: Open source
  - shadcn/ui components: MIT License
  - Groq SDK: Apache 2.0 License
  - Google Auth Library: Apache 2.0 License

## Evaluation & guardrails (hallucination/bias mitigations)

**AI Chat Therapy:**
- **Hallucination Mitigation:** 
  - Employing prompt engineering techniques with carefully crafted system prompts that guide the AI to provide empathetic, supportive responses while staying within therapeutic boundaries
  - Setting appropriate temperature parameters for AI responses to balance creativity with accuracy
  - Grounding the AI's knowledge base through context-aware conversation history (last 10 messages)
  - Emotion-aware responses that adapt to user's emotional state
  - Clear disclaimers that AI chat is not a substitute for professional human therapy

- **Bias Mitigation:** 
  - Continuous monitoring of AI responses for harmful stereotypes or biases
  - User feedback mechanisms to identify and address problematic outputs
  - Diverse prompt completions database to ensure varied, inclusive responses
  - Ethical guidelines embedded in system prompts to prevent discriminatory content
  - Regular review and updating of prompt templates

**Therapist/Event Data:**
- **Bias Mitigation:** 
  - Ensuring diversity in seeded therapist and event data across various specializations, locations, and demographics
  - Clear content guidelines for user-generated events and therapist profiles to prevent discriminatory or biased content
  - Geospatial matching ensures fair access to therapists regardless of location
  - Virtual therapy options eliminate geographic barriers

**User Data & Privacy:**
- **Data Protection:** 
  - Secure authentication with JWT tokens and password hashing (bcrypt)
  - Input validation and sanitization on all user inputs
  - CORS protection to prevent unauthorized access
  - User data encryption in transit (HTTPS)
  - Anonymous chat option for users who prefer privacy

## Known limitations & risks

- **AI Chat Accuracy:** While designed to be empathetic and helpful, the AI chat is not a substitute for professional human therapy and may occasionally provide inaccurate or unhelpful advice. Users should seek professional help for serious mental health concerns.

- **Geolocation Accuracy:** The accuracy of nearby therapist searches depends on the user's device geolocation capabilities and browser permissions. Results may vary based on GPS accuracy and network conditions.

- **Scalability:** The current architecture is suitable for a moderate user base. Significant scaling may require further optimization of database queries, server infrastructure, load balancing, and caching strategies.

- **Security:** While standard web security practices (JWT authentication, input validation, secure API handling, CORS protection) are implemented, continuous vigilance and updates are required to mitigate evolving security threats. Regular security audits are recommended.

- **Data Privacy:** Handling sensitive user data (mental health information, emotions, chat history) requires robust privacy policies and adherence to regulations (e.g., GDPR, HIPAA if applicable). Users should be informed about data usage and retention policies.

- **API Dependencies:** The application depends on external APIs (Groq, Google OAuth) which may experience downtime or rate limiting. Fallback mechanisms and error handling are implemented, but service interruptions could affect user experience.

- **Browser Compatibility:** Video chat features rely on Web Speech API which may not be available in all browsers or may require specific permissions. Users on unsupported browsers may have limited functionality.

- **Real-time Features:** Current implementation does not include real-time notifications or live updates. Future enhancements may require WebSocket integration for real-time therapist booking confirmations and event updates.

## Team (names, roles, contacts)
- **Satya Venkata Hemanth Challapalli:** Solo team , satyavhemanth2005@gmail.com .
- **Contact:** 
- GitHub: [https://github.com/chsvhemanth]
- Email: satyavhemanth2005@gmail.com
- Issues: Please report bugs or feature requests through GitHub Issues

---

**Version:** 1.0.0  
**Last Updated:** 2025

