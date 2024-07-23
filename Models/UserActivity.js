import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  count: {
    type: Number,
    required: true,
    default: 1
  }
});

export const UserActivity = mongoose.model('UserActivity', userActivitySchema);
