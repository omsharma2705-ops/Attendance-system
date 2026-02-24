const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', studentController.registerStudent);
router.post('/login', studentController.loginStudent);

// Protected routes
router.get('/profile/:studentId', authMiddleware.authenticate, studentController.getStudentProfile);
router.post('/add-face-embedding', authMiddleware.authenticate, studentController.addFaceEmbedding);
router.get('/all', authMiddleware.authenticate, studentController.getAllStudents);
router.get('/department/:department', authMiddleware.authenticate, studentController.getStudentsByDepartment);

module.exports = router;
