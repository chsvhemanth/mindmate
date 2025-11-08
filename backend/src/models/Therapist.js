import mongoose from 'mongoose';

const therapistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Therapist name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  specialization: {
    type: [String],
    required: [true, 'Specialization is required'],
    enum: [
      'anxiety',
      'depression',
      'trauma',
      'relationships',
      'addiction',
      'stress',
      'grief',
      'eating-disorders',
      'ocd',
      'ptsd',
      'general'
    ]
  },
  experience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates are required']
      }
    }
  },
  availability: {
    type: Map,
    of: [String], // Array of time slots for each day
    default: {}
  },
  rate: {
    type: Number,
    required: [true, 'Rate is required'],
    min: [0, 'Rate cannot be negative']
  },
  bio: {
    type: String,
    trim: true
  },
  qualifications: {
    type: [String],
    default: []
  },
  languages: {
    type: [String],
    default: ['English']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for geospatial queries
therapistSchema.index({ 'location.coordinates': '2dsphere' });
therapistSchema.index({ 'location.city': 1 });
therapistSchema.index({ specialization: 1 });
therapistSchema.index({ isAvailable: 1 });

// Method to calculate distance (Haversine formula)
therapistSchema.methods.calculateDistance = function(lat, lon) {
  const R = 6371; // Earth's radius in km
  // MongoDB stores coordinates as [longitude, latitude]
  const therapistLon = this.location.coordinates.coordinates[0];
  const therapistLat = this.location.coordinates.coordinates[1];
  const dLat = (therapistLat - lat) * Math.PI / 180;
  const dLon = (therapistLon - lon) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat * Math.PI / 180) * Math.cos(therapistLat * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const Therapist = mongoose.model('Therapist', therapistSchema);

export default Therapist;

