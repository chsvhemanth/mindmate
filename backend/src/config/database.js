import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindmate';
    
    // Validate MongoDB URI is set
    if (!process.env.MONGODB_URI) {
      console.warn('Warning: MONGODB_URI not set in .env, using default: mongodb://localhost:27017/mindmate');
    }

    // Log connection attempt (without exposing credentials)
    const uriInfo = mongoURI.includes('@') 
      ? `${mongoURI.split('@')[0].split('://')[0]}://*****@${mongoURI.split('@')[1]}` 
      : mongoURI;
    console.log(`Attempting to connect to MongoDB...`);

    const conn = await mongoose.connect(mongoURI, {
      // These options are no longer needed in newer Mongoose versions, but kept for compatibility
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Provide more helpful error messages
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('❌ MongoDB Authentication Failed');
      console.error('   The username or password in your MONGODB_URI is incorrect.');
      console.error('');
      console.error('   Common solutions:');
      console.error('   1. Check your .env file and verify MONGODB_URI credentials');
      console.error('   2. If using MongoDB Atlas:');
      console.error('      - Verify your database user credentials in Atlas dashboard');
      console.error('      - Ensure password is URL-encoded (special characters like @, #, etc.)');
      console.error('      - Example: mongodb+srv://username:password@cluster.mongodb.net/mindmate');
      console.error('   3. If using local MongoDB:');
      console.error('      - Try: mongodb://localhost:27017/mindmate (no auth)');
      console.error('      - Or set up authentication in MongoDB');
      console.error('');
      console.error('   Error details:', error.message);
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('❌ MongoDB Connection Failed');
      console.error('   Cannot reach MongoDB server.');
      console.error('   Error details:', error.message);
      console.error('');
      console.error('   Common solutions:');
      console.error('   1. Check if MongoDB is running (for local)');
      console.error('   2. Verify your connection string is correct');
      console.error('   3. Check network/firewall settings');
      console.error('   4. If using Atlas, verify IP is whitelisted');
    } else {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    }
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err.message}`);
});

export default connectDB;

