# MindMate Backend API

Backend server for the MindMate mental health application with MongoDB integration.

## Features

- User authentication and management
- Chat/conversation management
- Emotion tracking and analytics
- RESTful API endpoints
- MongoDB database integration

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A random secret key for JWT tokens
   - `PORT`: Server port (default: 5000)
   - `CORS_ORIGIN`: Frontend URL (default: http://localhost:5173)

## MongoDB Setup

### Local MongoDB
1. Install MongoDB on your machine
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/mindmate`

### MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` file

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/:userId` - Get user profile
- `PATCH /api/users/:userId` - Update user profile
- `DELETE /api/users/:userId` - Delete user account

### Chats
- `POST /api/chats` - Create a new chat
- `GET /api/chats/user/:userId` - Get all chats for a user
- `GET /api/chats/:chatId` - Get a specific chat
- `POST /api/chats/:chatId/messages` - Add a message to a chat
- `PATCH /api/chats/:chatId/title` - Update chat title
- `DELETE /api/chats/:chatId` - Delete a chat

### Emotions
- `POST /api/emotions` - Record a new emotion
- `GET /api/emotions/user/:userId` - Get emotion history
- `GET /api/emotions/user/:userId/stats` - Get emotion statistics
- `DELETE /api/emotions/:emotionId` - Delete an emotion record

## Database Models

### User
- username, email, password
- firstName, lastName, dateOfBirth
- preferences (theme, notifications)

### Chat
- userId (reference to User)
- title
- messages (array of message objects)
- emotionSummary

### Emotion
- userId (reference to User)
- emotion (calm, happy, sad, anxious, angry, excited, neutral)
- intensity (0-10)
- notes, context
- date

## Example API Requests

### Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Create Chat
```bash
curl -X POST http://localhost:5000/api/chats \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "title": "First Session"
  }'
```

### Add Message to Chat
```bash
curl -X POST http://localhost:5000/api/chats/CHAT_ID_HERE/messages \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I am feeling anxious today",
    "role": "user",
    "emotion": "anxious"
  }'
```

## License

ISC






