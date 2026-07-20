const Settings = require('../models/Settings');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Get profile details for authenticated user along with settings
 */
exports.getProfile = asyncHandler(async (req, res) => {
  const settings = await Settings.findOne({ userId: req.user._id });
  res.status(200).json({
    success: true,
    data: {
      user: req.user.toDTO(),
      settings: settings || null,
    },
  });
});

/**
 * Update profile configurations across User profile and Settings
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const {
    startingTotalLectures,
    startingAttendedLectures,
    minimumAttendancePercent,
    averageLecturesPerDay,
    weeklyPattern,
    theme,
  } = req.body;

  // Formulate updates for Settings collection
  const settingsUpdate = {};

  if (startingTotalLectures !== undefined) {
    settingsUpdate.startingTotalLectures = Number(startingTotalLectures);
  }
  if (startingAttendedLectures !== undefined) {
    settingsUpdate.startingAttendedLectures = Number(startingAttendedLectures);
  }
  if (minimumAttendancePercent !== undefined) {
    settingsUpdate.minimumAttendancePercent = Number(minimumAttendancePercent);
  }
  if (averageLecturesPerDay !== undefined) {
    settingsUpdate.averageLecturesPerDay = Number(averageLecturesPerDay);
  }
  if (weeklyPattern !== undefined) {
    settingsUpdate.weeklyPattern = weeklyPattern;
  }
  if (theme !== undefined) {
    settingsUpdate.themePreference = theme;
  }

  const updatedSettings = await Settings.findOneAndUpdate(
    { userId: req.user._id },
    { $set: settingsUpdate },
    { new: true, upsert: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile configuration updated successfully',
    data: {
      user: req.user.toDTO(),
      settings: updatedSettings,
    },
  });
});
