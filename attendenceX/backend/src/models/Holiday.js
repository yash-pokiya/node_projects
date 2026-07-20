const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Holiday date is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Holiday title is required'],
      trim: true,
    },
    appliesToAllSubjects: {
      type: Boolean,
      default: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Normalize date to midnight UTC before saving
holidaySchema.pre('save', function (next) {
  if (this.date) {
    const d = new Date(this.date);
    this.date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }
  next();
});

const Holiday = mongoose.model('Holiday', holidaySchema);

module.exports = Holiday;
