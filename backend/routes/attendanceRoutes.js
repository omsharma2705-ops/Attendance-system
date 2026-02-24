const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.post('/mark', authMiddleware.authenticate, attendanceController.markAttendance);
router.get('/date-range', authMiddleware.authenticate, attendanceController.getAttendanceByDateRange);
router.get('/student/:studentId', authMiddleware.authenticate, attendanceController.getStudentAttendance);
router.get('/class-report', authMiddleware.authenticate, attendanceController.getClassAttendanceReport);
router.get('/daily-summary', authMiddleware.authenticate, attendanceController.getDailyAttendanceSummary);
router.get('/export-csv', authMiddleware.authenticate, attendanceController.exportAttendanceCSV);

module.exports = router;
