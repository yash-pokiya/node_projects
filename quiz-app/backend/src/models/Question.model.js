const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  optionNumber: {
    type: Number,
    required: true,
    min: [1, 'Option number must be between 1 and 5'],
    max: [5, 'Option number must be between 1 and 5'],
  },
  text: {
    type: String,
    required: [true, 'Option text is required'],
  },
});

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A question must have a title'],
      trim: true,
      minlength: [10, 'A question title must have at least 10 characters'],
    },
    options: {
      type: [optionSchema],
      validate: {
        validator: function (val) {
          return val && val.length >= 2 && val.length <= 5;
        },
        message: 'A question must have between 2 and 5 options',
      },
    },
    correctAnswers: {
      type: [Number],
      required: [true, 'Correct answers are required'],
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: 'At least one correct answer must be selected',
      },
    },
    questionType: {
      type: String,
      enum: ['single', 'multiple'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty must be either easy, medium, or hard',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Question must belong to a user (admin)'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // Managed manually
  }
);

// Indexes
questionSchema.index({ isActive: 1 });
questionSchema.index({ category: 1 });
questionSchema.index({ difficulty: 1 });

// Pre-save hook to auto-set questionType and updatedAt
questionSchema.pre('save', function (next) {
  if (this.correctAnswers) {
    this.questionType = this.correctAnswers.length > 1 ? 'multiple' : 'single';
  }
  this.updatedAt = Date.now();
  next();
});

// Pre-update hooks to update updatedAt and questionType
questionSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update) {
    update.updatedAt = Date.now();
    if (update.correctAnswers) {
      update.questionType = update.correctAnswers.length > 1 ? 'multiple' : 'single';
    }
  }
  next();
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
