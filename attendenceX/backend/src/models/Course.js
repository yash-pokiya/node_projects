const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: [true, 'College reference is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
  },
  durationYears: {
    type: Number,
    default: 4,
  },
}, {
  timestamps: true,
});

courseSchema.index({ collegeId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Course', courseSchema);
