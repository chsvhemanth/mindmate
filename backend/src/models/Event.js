import mongoose from 'mongoose';

const eventParticipantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Event city is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
    trim: true
  },
  maxAttendees: {
    type: Number,
    required: [true, 'Maximum attendees is required'],
    min: [1, 'Maximum attendees must be at least 1']
  },
  category: {
    type: String,
    enum: ['meditation', 'support', 'workshop', 'social'],
    required: [true, 'Event category is required']
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Event host is required']
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  participants: [eventParticipantSchema],
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

// Virtual for getting approved attendees count
eventSchema.virtual('attendees').get(function() {
  return this.participants.filter(p => p.status === 'approved').length;
});

// Virtual for getting pending requests count
eventSchema.virtual('pendingRequests').get(function() {
  return this.participants.filter(p => p.status === 'pending').length;
});

// Method to check if event is full
eventSchema.methods.isFull = function() {
  return this.attendees >= this.maxAttendees;
};

// Method to check if user is already a participant
eventSchema.methods.hasParticipant = function(userId) {
  return this.participants.some(p => p.userId.toString() === userId.toString());
};

// Method to add participant
eventSchema.methods.addParticipant = function(userId, autoApprove = false) {
  if (this.hasParticipant(userId)) {
    throw new Error('User is already a participant');
  }
  
  if (this.isFull()) {
    throw new Error('Event is full');
  }

  const participant = {
    userId,
    status: autoApprove || !this.requiresApproval ? 'approved' : 'pending',
    requestedAt: new Date()
  };

  if (participant.status === 'approved') {
    participant.approvedAt = new Date();
  }

  this.participants.push(participant);
  return participant;
};

// Method to approve participant
eventSchema.methods.approveParticipant = function(userId) {
  if (this.isFull()) {
    throw new Error('Event is full');
  }

  const participant = this.participants.find(
    p => p.userId.toString() === userId.toString() && p.status === 'pending'
  );

  if (!participant) {
    throw new Error('Participant request not found');
  }

  participant.status = 'approved';
  participant.approvedAt = new Date();
  return participant;
};

// Method to reject participant
eventSchema.methods.rejectParticipant = function(userId) {
  const participant = this.participants.find(
    p => p.userId.toString() === userId.toString() && p.status === 'pending'
  );

  if (!participant) {
    throw new Error('Participant request not found');
  }

  participant.status = 'rejected';
  return participant;
};

// Indexes
eventSchema.index({ city: 1, date: 1 });
eventSchema.index({ hostId: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ 'participants.userId': 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;

