# MongoDB Setup Guide for MindMate

This guide will help you set up MongoDB for your MindMate project.

## Quick Start

### Option 1: MongoDB Atlas (Cloud - Recommended for Beginners)

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose the FREE tier (M0)
   - Select a cloud provider and region
   - Click "Create"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your IP address
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `mindmate`

6. **Update Backend Configuration**
   - In the `backend` folder, create a `.env` file (copy from `env.example`)
   - Set `MONGODB_URI` to your connection string:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindmate?retryWrites=true&w=majority
     ```

### Option 2: Local MongoDB

1. **Install MongoDB**
   - **Windows**: Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - **macOS**: `brew install mongodb-community`
   - **Linux**: Follow [MongoDB Installation Guide](https://www.mongodb.com/docs/manual/installation/)

2. **Start MongoDB Service**
   - **Windows**: MongoDB should start automatically as a service
   - **macOS/Linux**: `brew services start mongodb-community` or `sudo systemctl start mongod`

3. **Verify Installation**
   - Open a terminal and run: `mongosh` (or `mongo` for older versions)
   - You should see the MongoDB shell

4. **Update Backend Configuration**
   - In the `backend` folder, create a `.env` file
   - Set `MONGODB_URI` to:
     ```
     MONGODB_URI=mongodb://localhost:27017/mindmate
     ```

## Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment File**
   ```bash
   # Copy the example file
   cp env.example .env
   ```

4. **Edit `.env` File**
   - Set `MONGODB_URI` (as described above)
   - Set `JWT_SECRET` to a random string (e.g., use `openssl rand -base64 32`)
   - Set `PORT` if you want a different port (default: 5000)
   - Set `CORS_ORIGIN` to your frontend URL (default: http://localhost:5173)

5. **Start the Backend Server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

6. **Verify Connection**
   - Check the console for "MongoDB Connected" message
   - Visit `http://localhost:5000/api/health` in your browser
   - You should see: `{"success":true,"message":"Server is running",...}`

## Frontend Setup

1. **Add Environment Variable (Optional)**
   - Create a `.env` file in the `frontend` folder
   - Add: `VITE_API_URL=http://localhost:5000/api`
   - The frontend will use this URL to connect to the backend

2. **Install Dependencies (if not already done)**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the Frontend**
   ```bash
   npm run dev
   ```

## Testing the Integration

### Test Backend API

1. **Health Check**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Register a User**
   ```bash
   curl -X POST http://localhost:5000/api/users/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123",
       "firstName": "Test",
       "lastName": "User"
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

### Test Frontend Connection

1. Open the frontend in your browser
2. Check the browser console for any API connection errors
3. Try using the chat feature - it should now save to MongoDB

## Troubleshooting

### MongoDB Connection Issues

- **Error: "MongoServerError: Authentication failed"**
  - Check your username and password in the connection string
  - Verify database user has proper permissions

- **Error: "MongooseServerSelectionError: connect ECONNREFUSED"**
  - MongoDB service is not running
  - Check if MongoDB is installed and started
  - Verify the connection string is correct

- **Error: "MongoNetworkError: failed to connect"**
  - Check your network/firewall settings
  - For Atlas: Verify IP address is whitelisted
  - Check if the MongoDB URI is correct

### Backend Issues

- **Port already in use**
  - Change the PORT in `.env` file
  - Or stop the process using port 5000

- **CORS errors**
  - Make sure `CORS_ORIGIN` in `.env` matches your frontend URL
  - Check if the backend is running

### Frontend Issues

- **API connection errors**
  - Verify backend is running on the correct port
  - Check `VITE_API_URL` in frontend `.env`
  - Check browser console for specific error messages

## Next Steps

1. Implement authentication in the frontend
2. Connect chat functionality to save messages to MongoDB
3. Add emotion tracking and analytics
4. Implement user profiles and preferences
5. Add data persistence for all features

## Additional Resources

- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)

