import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// Initialize Google OAuth client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback'
);

// Google OAuth login
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token is required'
      });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, given_name, family_name } = payload;

    // Check if user exists
    let user = await User.findOne({ 
      $or: [{ googleId }, { email }]
    });

    if (user) {
      // Update user if they logged in with Google before but didn't have googleId
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        if (picture) user.picture = picture;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        email,
        googleId,
        firstName: given_name || name?.split(' ')[0],
        lastName: family_name || name?.split(' ').slice(1).join(' '),
        picture,
        authProvider: 'google',
        username: email.split('@')[0] + '_' + googleId.substring(0, 6) // Generate unique username
      });
      await user.save();
    }

    const jwtToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture,
          authProvider: user.authProvider
        },
        token: jwtToken
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Google authentication failed'
    });
  }
};

