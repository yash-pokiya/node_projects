const mongoose = require('mongoose');

const lectureSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject reference is required'],
    index: true,
  },
  date: {
    type: Date,
    required: [true, 'Session date is required'],
    index: true,
  },
  period: {
    type: Number,
    required: [true, 'Period slot number is required'],
  },
  type: {
    type: String,
    enum: ['regular', 'extra', 'lab'],
    default: 'regular',
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },
  cancellationReason: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// A unique combination ensures no duplicate periods are registered for a single user on any given date
lectureSessionSchema.index({ userId: 1, date: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('LectureSession', lectureSessionSchema);
