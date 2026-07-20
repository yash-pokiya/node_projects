const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course reference is required'],
    index: true,
  },
  semesterNumber: {
    type: Number,
    required: [true, 'Semester number is required'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  academicWeeksCount: {
    type: Number,
    default: 15,
  },
}, {
  timestamps: true,
});

semesterSchema.index({ courseId: 1, semesterNumber: 1 }, { unique: true });

module.exports = mongoose.model('Semester', semesterSchema);
