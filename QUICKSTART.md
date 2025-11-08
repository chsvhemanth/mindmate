# MindMate - Quick Start Guide

## Overview

MindMate now has a complete backend with MongoDB integration! This guide will help you get started quickly.

## Project Structure

```
Mindmate/
├── backend/          # Node.js/Express backend with MongoDB
│   ├── src/
│   │   ├── config/   # Database configuration
│   │   ├── models/   # MongoDB models (User, Chat, Emotion)
│   │   ├── controllers/ # API controllers
│   │   ├── routes/   # API routes
│   │   └── server.js # Main server file
│   └── package.json
├── frontend/         # React/TypeScript frontend
└── SETUP.md         # Detailed setup instructions
```

## Quick Setup (5 Minutes)

### 1. Install MongoDB

**Option A: MongoDB Atlas (Cloud - Easiest)**
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- Create a free cluster
- Get your connection string

**Option B: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Use: `mongodb://localhost:27017/mindmate`

### 2. Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from env.example)
# Edit .env and add your MongoDB URI
# Example:
# MONGODB_URI=mongodb://localhost:27017/mindmate
# or
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindmate

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Set Up Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Optional: Create .env file with API URL
# VITE_API_URL=http://localhost:5000/api

# Start the frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:userId` - Get user profile

### Chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/user/:userId` - Get user's chats
- `POST /api/chats/:chatId/messages` - Add message to chat

### Emotions
- `POST /api/emotions` - Record emotion
- `GET /api/emotions/user/:userId` - Get emotion history
- `GET /api/emotions/user/:userId/stats` - Get emotion statistics

## Testing the Connection

1. **Check Backend Health**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Register a Test User**
   ```bash
   curl -X POST http://localhost:5000/api/users/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

3. **Create a Chat**
   ```bash
   curl -X POST http://localhost:5000/api/chats \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "USER_ID_FROM_REGISTRATION",
       "title": "First Session"
     }'
   ```

## Frontend Integration

The frontend now has an API utility file at `frontend/src/utils/api.ts` that provides:

- `userAPI` - User registration, login, profile management
- `chatAPI` - Chat creation, message sending, chat management
- `emotionAPI` - Emotion tracking and statistics

### Example Usage in Frontend

```typescript
import { chatAPI, emotionAPI } from '@/utils/api';

// Create a chat
const response = await chatAPI.createChat(userId, 'My First Chat');

// Add a message
await chatAPI.addMessage(chatId, {
  content: 'I am feeling anxious today',
  role: 'user',
  emotion: 'anxious'
});

// Record an emotion
await emotionAPI.recordEmotion({
  userId: userId,
  emotion: 'anxious',
  intensity: 7
});
```

## Next Steps

1. **Connect Chat Component**: Update `frontend/src/pages/Chat.tsx` to use the API
2. **Add Authentication**: Implement login/register in the frontend
3. **Save Messages**: Connect chat messages to MongoDB
4. **Emotion Tracking**: Implement emotion analytics dashboard
5. **User Profiles**: Add user profile management

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists and has correct `MONGODB_URI`
- Check if port 5000 is available

### MongoDB connection fails
- Verify MongoDB is running (local) or cluster is active (Atlas)
- Check connection string in `.env`
- For Atlas: Verify IP address is whitelisted
- Check username/password are correct

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend `.env`

## Documentation

- **Detailed Setup**: See `SETUP.md`
- **Backend API**: See `backend/README.md`
- **MongoDB Docs**: https://www.mongodb.com/docs/

## Support

For issues or questions:
1. Check `SETUP.md` for detailed troubleshooting
2. Verify all environment variables are set correctly
3. Check MongoDB connection
4. Review backend server logs

---

**Happy Coding! 🚀**

