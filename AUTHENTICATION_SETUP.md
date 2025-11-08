# Authentication & Groq Integration Setup Guide

This guide explains the Google OAuth and Groq integration that has been added to MindMate.

## What's Been Implemented

### Backend Changes

1. **Google OAuth Authentication**
   - Added `google-auth-library` package
   - Created `authController.js` with Google OAuth handler
   - Updated `User` model to support Google OAuth (googleId, picture, authProvider fields)
   - Added `/api/auth/google` endpoint for Google sign-in

2. **Groq AI Integration**
   - Added `groq-sdk` package
   - Created therapist-like AI chat endpoint at `/api/chats/ai/response`
   - Configured with empathetic system prompts for mental health support
   - Uses Llama 3.1 70B model for high-quality responses

3. **Authentication Middleware**
   - Created `auth.js` middleware for JWT token verification
   - Protects chat API endpoints

### Frontend Changes

1. **Authentication System**
   - Created `AuthContext` for global auth state management
   - Added `LoginDialog` component with email/password and Google sign-in
   - Created `GoogleSignInButton` component
   - Updated `Index` page with sign-in/logout functionality
   - Updated `Chat` page to require authentication

2. **Chat Integration**
   - Updated `Chat.tsx` to use backend Groq API instead of placeholder
   - Sends conversation history for context-aware responses
   - Includes emotion analysis in API calls

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Variables
Create a `.env` file in the `backend` directory (copy from `env.example`):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mindmate
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindmate

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Origins
CORS_ORIGIN=http://localhost:5173

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Groq API Configuration
GROQ_API_KEY=your-groq-api-key
```

#### Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API (or Google Identity Services API)
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application"
6. **IMPORTANT: Add ALL authorized JavaScript origins:**
   - `http://localhost:5173` (default Vite port)
   - `http://localhost:8080` (your current frontend port)
   - `http://localhost:5000` (backend port)
   - Add any other ports you might use
7. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:8080` (for popup-based flows)
   - `http://localhost:5173` (for popup-based flows)
8. Copy the Client ID and Client Secret to your `.env` file

**Note:** If you're getting "origin_mismatch" error, it means your frontend URL (e.g., `http://localhost:8080`) is not in the authorized JavaScript origins list. Make sure to add it!

#### Get Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy it to your `.env` file

### 2. Frontend Setup

#### Environment Variables
Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Google OAuth Configuration (same Client ID as backend)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

**Note:** The frontend uses the same Google Client ID as the backend.

### 3. Running the Application

#### Start Backend
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

#### Start Frontend
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

### Signing In

1. Click "Sign In" button on the homepage
2. Choose one of:
   - **Google Sign-In**: Click "Sign in with Google" button
   - **Email/Password**: Enter credentials or create a new account

### Using the Chat

1. After signing in, navigate to the Chat page
2. Start typing your message
3. The AI will respond with therapist-like, empathetic responses powered by Groq
4. The system maintains conversation context for better responses

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `POST /api/users/login` - Email/password login
- `POST /api/users/register` - User registration

### Chat
- `POST /api/chats/ai/response` - Get AI response (requires authentication)
  - Body: `{ message: string, conversationHistory: array, emotion?: string }`
  - Returns: `{ response: string, emotion: string }`

## Features

### Therapist-Like AI Responses
The Groq integration is configured with a system prompt that makes the AI:
- Respond with empathy and understanding
- Ask thoughtful questions
- Provide gentle guidance
- Maintain professional boundaries
- Keep responses concise but meaningful
- Use a warm, conversational tone

### Emotion-Aware
The chat system analyzes user emotions and includes them in the context for more personalized responses.

### Secure Authentication
- JWT tokens for session management
- Google OAuth for secure third-party authentication
- Protected API endpoints

## Troubleshooting

### Google Sign-In Not Working
- Verify `VITE_GOOGLE_CLIENT_ID` is set in frontend `.env`
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in backend `.env`
- Check that authorized origins/redirects are configured in Google Cloud Console
- Check browser console for errors

### Groq API Errors
- Verify `GROQ_API_KEY` is set in backend `.env`
- Check Groq API key is valid and has credits
- Check backend logs for specific error messages

### Authentication Issues
- Clear browser localStorage
- Verify JWT_SECRET is set in backend `.env`
- Check that MongoDB is running and connected

## Next Steps

1. Set up your Google OAuth credentials
2. Get a Groq API key
3. Configure environment variables
4. Install dependencies and run the application
5. Test the authentication and chat features

For more details, see `SETUP.md` and `QUICKSTART.md`.

