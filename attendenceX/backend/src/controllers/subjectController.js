const subjectService = require('../services/subjectService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Create course subject
 */
exports.createSubject = asyncHandler(async (req, res) => {
  const subject = await subjectService.createSubject(req.user._id, req.body);
  res.status(201).json({
    success: true,
    message: 'Subject created successfully',
    data: {
      subject,
    },
  });
});

/**
 * Get active (or all) subjects
 */
exports.getSubjects = asyncHandler(async (req, res) => {
  const includeInactive = req.query.includeInactive === 'true';
  const subjects = await subjectService.getSubjects(req.user._id, includeInactive);
  res.status(200).json({
    success: true,
    data: {
      subjects,
    },
  });
});

/**
 * Get a specific subject by ID
 */
exports.getSubjectById = asyncHandler(async (req, res) => {
  const subject = await subjectService.getSubjectById(req.user._id, req.params.id);
  res.status(200).json({
    success: true,
    data: {
      subject,
    },
  });
});

/**
 * Update subject parameters and syllabus milestones
 */
exports.updateSubject = asyncHandler(async (req, res) => {
  const subject = await subjectService.updateSubject(req.user._id, req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Subject updated successfully',
    data: {
      subject,
    },
  });
});

/**
 * Soft delete a subject (archives it)
 */
exports.deleteSubject = asyncHandler(async (req, res) => {
  await subjectService.deleteSubject(req.user._id, req.params.id);
  res.status(200).json({
    success: true,
    message: 'Subject archived successfully',
  });
});
