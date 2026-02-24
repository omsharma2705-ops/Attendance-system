const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', teacherController.registerTeacher);
router.post('/login', teacherController.loginTeacher);

// Protected routes
router.get('/profile/:teacherId', authMiddleware.authenticate, teacherController.getTeacherProfile);
router.get('/all', authMiddleware.authenticate, teacherController.getAllTeachers);

module.exports = router;
