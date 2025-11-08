#!/usr/bin/env node

/**
 * Setup script for MindMate backend
 * This script helps create the .env file if it doesn't exist
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('🚀 MindMate Backend Setup\n');
  
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, 'env.example');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question('.env file already exists. Overwrite? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }
  
  // Read example file
  let envContent = '';
  if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, 'utf-8');
  }
  
  // Get user input
  console.log('\nPlease provide the following information:\n');
  
  const port = await question('Server Port (default: 5000): ') || '5000';
  const nodeEnv = await question('Node Environment (default: development): ') || 'development';
  const mongoUri = await question('MongoDB URI (default: mongodb://localhost:27017/mindmate): ') || 'mongodb://localhost:27017/mindmate';
  const jwtSecret = await question('JWT Secret (press Enter to generate random): ') || generateRandomSecret();
  const corsOrigin = await question('CORS Origin (default: http://localhost:5173): ') || 'http://localhost:5173';
  
  // Create .env content
  const newEnvContent = `# Server Configuration
PORT=${port}
NODE_ENV=${nodeEnv}

# MongoDB Configuration
MONGODB_URI=${mongoUri}

# JWT Secret
JWT_SECRET=${jwtSecret}

# CORS Origins
CORS_ORIGIN=${corsOrigin}
`;
  
  // Write .env file
  fs.writeFileSync(envPath, newEnvContent);
  
  console.log('\n✅ .env file created successfully!');
  console.log('\nNext steps:');
  console.log('1. Make sure MongoDB is running');
  console.log('2. Run: npm install');
  console.log('3. Run: npm run dev');
  console.log('\n');
  
  rl.close();
}

function generateRandomSecret() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

setup().catch(console.error);



