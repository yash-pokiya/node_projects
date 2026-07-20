const mongoose = require('mongoose');

const historyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    prevTotal: {
      type: Number,
      required: true,
    },
    prevAttended: {
      type: Number,
      required: true,
    },
    addedTotal: {
      type: Number,
      required: true,
    },
    addedAttended: {
      type: Number,
      required: true,
    },
    newTotal: {
      type: Number,
      required: true,
    },
    newAttended: {
      type: Number,
      required: true,
    },
    complianceBefore: {
      type: Number,
      required: true,
    },
    complianceAfter: {
      type: Number,
      required: true,
    },
    actionType: {
      type: String,
      default: 'manual_update',
    },
  },
  {
    timestamps: true,
  }
);

// Index to retrieve last logged record quickly
historyLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('HistoryLog', historyLogSchema);
