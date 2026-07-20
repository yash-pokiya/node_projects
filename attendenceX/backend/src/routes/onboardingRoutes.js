const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');
const { protect } = require('../middleware/authMiddleware');

// Public lookups to facilitate search during onboarding form setups
router.get('/universities', onboardingController.getUniversities);
router.post('/universities', onboardingController.createUniversity);

router.get('/colleges', onboardingController.getColleges);
router.post('/colleges', onboardingController.createCollege);

router.get('/courses', onboardingController.getCourses);
router.post('/courses', onboardingController.createCourse);

router.get('/semesters', onboardingController.getSemesters);
router.post('/semesters', onboardingController.createSemester);

// Protected endpoint to submit user profile settings setup
router.post('/submit', protect, onboardingController.submitOnboarding);

module.exports = router;
