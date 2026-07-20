const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'University name is required'],
    unique: true,
    trim: true,
  },
  shortName: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    default: 'India',
  },
  state: {
    type: String,
  },
  domains: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
}, {
  timestamps: true,
});

universitySchema.index({ name: 1 });

module.exports = mongoose.model('University', universitySchema);
