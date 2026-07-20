const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: [true, 'University reference is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'College name is required'],
    trim: true,
  },
  campusLocation: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

collegeSchema.index({ universityId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('College', collegeSchema);
