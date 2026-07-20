const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    lectureSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LectureSession',
      required: [true, 'Lecture session reference is required'],
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        'present',
        'absent',
        'medical',
        'sports',
        'industrial_visit',
        'late',
        'half',
        'holiday',
      ],
      required: [true, 'Attendance status is required'],
    },
    markedAt: {
      type: Date,
      default: Date.now,
    },
    location: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      isWithinCampus: { type: Boolean, default: null },
    },
    remarks: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
