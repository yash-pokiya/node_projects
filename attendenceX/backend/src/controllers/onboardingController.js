const User = require('../models/User');
const Settings = require('../models/Settings');

/**
 * Public lookups stubs (Not used in V1 Student Productivity, kept for route integrity)
 */
exports.getUniversities = async (req, res, next) => {
  res.json({ success: true, count: 0, data: [] });
};
exports.createUniversity = async (req, res, next) => {
  res.status(201).json({ success: true, data: {} });
};
exports.getColleges = async (req, res, next) => {
  res.json({ success: true, count: 0, data: [] });
};
exports.createCollege = async (req, res, next) => {
  res.status(201).json({ success: true, data: {} });
};
exports.getCourses = async (req, res, next) => {
  res.json({ success: true, count: 0, data: [] });
};
exports.createCourse = async (req, res, next) => {
  res.status(201).json({ success: true, data: {} });
};
exports.getSemesters = async (req, res, next) => {
  res.json({ success: true, count: 0, data: [] });
};
exports.createSemester = async (req, res, next) => {
  res.status(201).json({ success: true, data: {} });
};

/**
 * Submit onboarding settings, updates user profile and upserts Settings record
 */
exports.submitOnboarding = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      startingTotalLectures,
      startingAttendedLectures,
      minimumAttendancePercent,
      averageLecturesPerDay,
      weeklyPattern,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student account not found.' });
    }

    // Reset old ERP structures
    user.academicProfile = {
      universityId: null,
      collegeId: null,
      courseId: null,
      semesterId: null,
      division: '',
      rollNumber: '',
    };
    user.isOnboarded = true;
    await user.save();

    // Upsert Settings document
    const updatedSettings = await Settings.findOneAndUpdate(
      { userId },
      {
        startingTotalLectures: startingTotalLectures !== undefined ? Number(startingTotalLectures) : 0,
        startingAttendedLectures: startingAttendedLectures !== undefined ? Number(startingAttendedLectures) : 0,
        minimumAttendancePercent: minimumAttendancePercent !== undefined ? Number(minimumAttendancePercent) : 75,
        averageLecturesPerDay: averageLecturesPerDay !== undefined ? Number(averageLecturesPerDay) : 4,
        weeklyPattern: weeklyPattern || [4, 4, 4, 4, 4, 0, 0],
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Onboarding completed successfully.',
      data: {
        user: user.toDTO(),
        settings: updatedSettings,
      },
    });
  } catch (err) {
    next(err);
  }
};
