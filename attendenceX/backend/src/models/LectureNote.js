const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
});

const lectureNoteSchema = new mongoose.Schema(
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
      index: true,
    },
    attendanceRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttendanceRecord',
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Lecture note title is required'],
      trim: true,
    },
    contentMarkdown: {
      type: String,
      default: '',
    },
    tags: [{ type: String, trim: true }],
    resources: [resourceSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for study hub lookups
lectureNoteSchema.index({ userId: 1, subjectId: 1 });
lectureNoteSchema.index({ attendanceRecordId: 1 }, { sparse: true });

const LectureNote = mongoose.model('LectureNote', lectureNoteSchema);

module.exports = LectureNote;
