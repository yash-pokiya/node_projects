const mongoose = require('mongoose');

const syllabusMilestoneSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  completedDate: { type: Date, default: null }
});

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    semesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Semester',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    code: {
      type: String,
      default: '',
      trim: true,
    },
    facultyName: {
      type: String,
      default: '',
      trim: true,
    },
    credits: {
      type: Number,
      default: 0,
      min: [0, 'Credits cannot be negative'],
    },
    minimumAttendanceOverride: {
      type: Number,
      default: null,
      min: [0, 'Minimum attendance cannot be less than 0'],
      max: [100, 'Minimum attendance cannot exceed 100'],
    },
    color: {
      type: String,
      default: '',
      trim: true,
    },
    syllabusMilestones: [syllabusMilestoneSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

subjectSchema.index({ userId: 1, isActive: 1 });
subjectSchema.index({ userId: 1, name: 1 });

// Pre-save hook to assign rotating colors if not provided
subjectSchema.pre('save', async function (next) {
  if (!this.color) {
    try {
      const colors = [
        '#10b981', // Emerald
        '#3b82f6', // Blue
        '#8b5cf6', // Violet
        '#f59e0b', // Amber
        '#ec4899', // Pink
        '#06b6d4', // Cyan
        '#14b8a6', // Teal
        '#f43f5e', // Rose
      ];
      
      const count = await this.constructor.countDocuments({ userId: this.userId });
      this.color = colors[count % colors.length];
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
