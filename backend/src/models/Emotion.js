import mongoose from 'mongoose';

const emotionRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  emotion: {
    type: String,
    enum: ['calm', 'happy', 'sad', 'anxious', 'angry', 'excited', 'neutral'],
    required: [true, 'Emotion type is required']
  },
  intensity: {
    type: Number,
    min: 0,
    max: 10,
    default: 5
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  context: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for queries by user and date
emotionRecordSchema.index({ userId: 1, date: -1 });

const Emotion = mongoose.model('Emotion', emotionRecordSchema);

export default Emotion;






