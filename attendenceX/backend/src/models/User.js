const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    academicProfile: {
      universityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        default: null,
      },
      collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        default: null,
      },
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: null,
      },
      semesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester',
        default: null,
      },
      division: {
        type: String,
        default: '',
        trim: true,
      },
      rollNumber: {
        type: String,
        default: '',
        trim: true,
      },
    },
    streakStats: {
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastMarkedDate: { type: Date, default: null }
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save password hashing using Argon2
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  try {
    this.passwordHash = await argon2.hash(this.passwordHash, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,         // 3 iterations
      parallelism: 4,      // 4 threads
    });
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password using Argon2 verify
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await argon2.verify(this.passwordHash, candidatePassword);
  } catch (err) {
    return false;
  }
};

// Response DTO shaping
userSchema.methods.toDTO = function () {
  const userObj = this.toObject();
  delete userObj.passwordHash;
  delete userObj.refreshToken;
  delete userObj.__v;
  return userObj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
