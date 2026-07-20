const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject ID is required'],
    },
    cycleType: {
      type: String,
      enum: ['weekly', 'biweekly'],
      default: 'weekly',
    },
    weekNumber: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },
    dayOfWeek: {
      type: Number,
      required: [true, 'Day of week is required'],
      min: [0, 'Day of week must be between 0 (Sunday) and 6 (Saturday)'],
      max: [6, 'Day of week must be between 0 (Sunday) and 6 (Saturday)'],
    },
    period: {
      type: Number,
      required: [true, 'Period slot number is required'],
      min: [1, 'Period must be 1 or greater'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:mm format'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:mm format'],
    },
    classroom: {
      type: String,
      default: '',
      trim: true,
    },
    instructorName: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for cycle searches
timetableSchema.index({ userId: 1, cycleType: 1, weekNumber: 1, dayOfWeek: 1, period: 1 }, { unique: true });

// Pre-save validation to prevent period overlapping
timetableSchema.pre('save', async function (next) {
  try {
    // If weekly slot, it conflicts with both week 1 and week 2 of the same period.
    // If bi-weekly slot, it conflicts with weekly slots, and same-week bi-weekly slots.
    const query = {
      userId: this.userId,
      dayOfWeek: this.dayOfWeek,
      period: this.period,
      _id: { $ne: this._id },
    };

    if (this.cycleType === 'biweekly') {
      // Conflict if there's a weekly slot, or same-week biweekly slot
      query.$or = [
        { cycleType: 'weekly' },
        { cycleType: 'biweekly', weekNumber: this.weekNumber }
      ];
    } else {
      // Conflict if there's any slot (weekly or biweekly of either week)
      // No extra constraints needed because weekly blocks everything on that period
    }

    const overlap = await this.constructor.findOne(query);

    if (overlap) {
      const err = new Error(`Schedule slot collision! Period ${this.period} is already booked on this day.`);
      err.statusCode = 400;
      return next(err);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
