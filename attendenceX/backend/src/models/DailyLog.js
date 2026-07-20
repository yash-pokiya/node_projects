const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Log date is required'],
    },
    totalLectures: {
      type: Number,
      required: [true, 'Total lectures today is required'],
      min: 0,
    },
    attendedLectures: {
      type: Number,
      required: [true, 'Attended lectures today is required'],
      min: 0,
      validate: {
        validator: function (val) {
          const total = this.totalLectures !== undefined 
            ? this.totalLectures 
            : this.getUpdate()?.totalLectures !== undefined
            ? this.getUpdate().totalLectures
            : this.getUpdate()?.$set?.totalLectures;
          
          if (total === undefined) return true;
          return val <= total;
        },
        message: 'Attended lectures cannot exceed total lectures held today.',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes to speed up queries by user and date ranges
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
