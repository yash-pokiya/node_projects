const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    unique: true,
    index: true,
  },
  themePreference: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'light',
  },
  minimumAttendancePercent: {
    type: Number,
    default: 75,
    min: 0,
    max: 100,
  },
  lecturesPerDayLimit: {
    type: Number,
    default: 6,
    min: 1,
    max: 20,
  },
  averageLecturesPerDay: {
    type: Number,
    default: 4,
    min: 1,
    max: 20,
  },
  startingTotalLectures: {
    type: Number,
    default: 0,
    min: 0,
  },
  startingAttendedLectures: {
    type: Number,
    default: 0,
    min: 0,
  },
  weeklyPattern: {
    type: [Number],
    default: [4, 4, 4, 4, 4, 0, 0], // index 0 = Mon, 6 = Sun
  },
  statusCountingRules: {
    medical: {
      type: String,
      enum: ['neutral', 'present', 'absent'],
      default: 'neutral',
    },
    sports: {
      type: String,
      enum: ['neutral', 'present', 'absent'],
      default: 'neutral',
    },
    industrial_visit: {
      type: String,
      enum: ['neutral', 'present', 'absent'],
      default: 'neutral',
    },
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  notifications: {
    emailDailySummary: {
      type: Boolean,
      default: true,
    },
    pushReminderBeforeClass: {
      type: Boolean,
      default: false,
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);
