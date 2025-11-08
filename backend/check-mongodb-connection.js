import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Helper script to test MongoDB connection
 * Usage: node check-mongodb-connection.js
 */

async function testConnection() {
  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    console.error('❌ MONGODB_URI is not set in .env file');
    console.log('\nPlease create a .env file in the backend directory with:');
    console.log('MONGODB_URI=your_connection_string_here');
    process.exit(1);
  }

  console.log('Testing MongoDB connection...');
  console.log('Connection string format:', mongoURI.replace(/:[^:@]+@/, ':*****@'));

  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Successfully connected to MongoDB!');
    console.log('   Host:', mongoose.connection.host);
    console.log('   Database:', mongoose.connection.name);
    await mongoose.disconnect();
    console.log('✅ Connection test passed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection test failed');
    console.error('   Error:', error.message);
    
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.log('\n💡 Authentication Error Tips:');
      console.log('   1. Verify username and password in MongoDB Atlas/Local MongoDB');
      console.log('   2. If password contains special characters, URL-encode them:');
      console.log('      - @ → %40');
      console.log('      - # → %23');
      console.log('      - / → %2F');
      console.log('      - : → %3A');
      console.log('   3. Example connection string format:');
      console.log('      mongodb+srv://username:password@cluster.mongodb.net/mindmate');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Network Error Tips:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify the cluster hostname is correct');
      console.log('   3. If using Atlas, check if your IP is whitelisted');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Connection Refused Tips:');
      console.log('   1. Check if MongoDB is running (for local MongoDB)');
      console.log('   2. Verify the port number (default: 27017)');
      console.log('   3. Check firewall settings');
    }
    
    process.exit(1);
  }
}

testConnection();

