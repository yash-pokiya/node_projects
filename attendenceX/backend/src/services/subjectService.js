const Subject = require('../models/Subject');

/**
 * Create a new course subject
 */
const createSubject = async (userId, subjectData) => {
  // Pre-process syllabusOutline if present
  if (Array.isArray(subjectData.syllabusOutline)) {
    subjectData.syllabusOutline.forEach((item) => {
      if (item.isCompleted && !item.completedDate) {
        item.completedDate = new Date();
      }
    });
  }

  const subject = new Subject({
    ...subjectData,
    userId,
  });

  return await subject.save();
};

/**
 * Get active (or all) subjects for a user
 */
const getSubjects = async (userId, includeInactive = false) => {
  const query = { userId };
  if (!includeInactive) {
    query.isActive = true;
  }
  return await Subject.find(query).sort({ name: 1 });
};

/**
 * Get a specific subject by ID
 */
const getSubjectById = async (userId, subjectId) => {
  const subject = await Subject.findOne({ _id: subjectId, userId, isActive: true });
  if (!subject) {
    const error = new Error('Subject not found or access denied');
    error.statusCode = 404;
    throw error;
  }
  return subject;
};

/**
 * Update subject parameters and syllabus milestones
 */
const updateSubject = async (userId, subjectId, updateData) => {
  const subject = await getSubjectById(userId, subjectId);

  const allowedUpdates = [
    'name',
    'code',
    'facultyName',
    'credits',
    'minimumAttendanceOverride',
    'color',
    'syllabusOutline',
  ];

  allowedUpdates.forEach((field) => {
    if (updateData[field] !== undefined) {
      if (field === 'syllabusOutline' && Array.isArray(updateData.syllabusOutline)) {
        // Map updates to check if isCompleted is newly set to true
        updateData.syllabusOutline.forEach((updatedItem) => {
          // If the topic is marked completed, ensure date is timestamped
          if (updatedItem.isCompleted && !updatedItem.completedDate) {
            updatedItem.completedDate = new Date();
          } else if (!updatedItem.isCompleted) {
            updatedItem.completedDate = null;
          }
        });
        subject.syllabusOutline = updateData.syllabusOutline;
      } else {
        subject[field] = updateData[field];
      }
    }
  });

  return await subject.save();
};

/**
 * Soft delete a subject (Mark isActive = false)
 */
const deleteSubject = async (userId, subjectId) => {
  const subject = await getSubjectById(userId, subjectId);
  subject.isActive = false;
  return await subject.save();
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
