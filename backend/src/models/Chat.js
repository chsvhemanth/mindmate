import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  emotion: {
    type: String,
    enum: ['calm', 'happy', 'sad', 'anxious', 'angry', 'excited', 'neutral'],
    default: 'neutral'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  title: {
    type: String,
    trim: true,
    default: 'New Conversation'
  },
  messages: [messageSchema],
  emotionSummary: {
    type: Map,
    of: Number, // Count of each emotion
    default: {}
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

// Update emotion summary when messages are added
chatSchema.methods.updateEmotionSummary = function() {
  const summary = {};
  this.messages.forEach(message => {
    if (message.emotion && message.role === 'user') {
      summary[message.emotion] = (summary[message.emotion] || 0) + 1;
    }
  });
  this.emotionSummary = summary;
  return summary;
};

// Index for faster queries
chatSchema.index({ userId: 1, createdAt: -1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;





