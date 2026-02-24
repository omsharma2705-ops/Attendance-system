const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { stringify } = require('csv-stringify/sync');

// Mark attendance with face recognition
exports.markAttendance = async (req, res) => {
  try {
    const { studentIds, subject, class: className, teacherId, livenessVerified } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: 'No students to mark attendance' });
    }

    const attendanceRecords = [];
    const now = new Date();

    for (const studentId of studentIds) {
      const attendance = new Attendance({
        student: studentId,
        date: now,
        subject,
        class: className,
        teacher: teacherId,
        status: 'present',
        livenessVerified,
        attendanceTime: now.toLocaleTimeString(),
      });

      await attendance.save();
      attendanceRecords.push(attendance);
    }

    res.status(201).json({
      message: `Attendance marked for ${attendanceRecords.length} students`,
      count: attendanceRecords.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
};

// Get attendance by date range
exports.getAttendanceByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, student, subject, teacher } = req.query;

    let query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (student) query.student = student;
    if (subject) query.subject = subject;
    if (teacher) query.teacher = teacher;

    const attendance = await Attendance.find(query)
      .populate('student', 'name rollNumber email')
      .populate('teacher', 'name employeeId')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
};

// Get attendance for a specific student
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    let query = { student: studentId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'name rollNumber')
      .populate('teacher', 'name employeeId')
      .sort({ date: -1 });

    // Calculate attendance percentage
    const totalClasses = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const attendancePercentage = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

    res.json({
      attendance,
      summary: {
        totalClasses,
        present: presentCount,
        absent: totalClasses - presentCount,
        attendancePercentage: attendancePercentage.toFixed(2),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student attendance', error: error.message });
  }
};

// Get attendance report for a class
exports.getClassAttendanceReport = async (req, res) => {
  try {
    const { class: className, subject, date } = req.query;

    let query = {
      class: className,
    };

    if (subject) query.subject = subject;
    if (date) {
      const checkDate = new Date(date);
      query.date = {
        $gte: new Date(checkDate.setHours(0, 0, 0, 0)),
        $lte: new Date(checkDate.setHours(23, 59, 59, 999)),
      };
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'name rollNumber email')
      .populate('teacher', 'name employeeId')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class attendance report', error: error.message });
  }
};

// Export attendance as CSV
exports.exportAttendanceCSV = async (req, res) => {
  try {
    const { startDate, endDate, subject, class: className } = req.query;

    let query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (subject) query.subject = subject;
    if (className) query.class = className;

    const attendance = await Attendance.find(query)
      .populate('student', 'name rollNumber email department')
      .populate('teacher', 'name employeeId')
      .lean();

    if (attendance.length === 0) {
      return res.status(400).json({ message: 'No attendance records found' });
    }

    const csvData = attendance.map(record => ({
      studentName: record.student?.name || 'N/A',
      rollNumber: record.student?.rollNumber || 'N/A',
      email: record.student?.email || 'N/A',
      department: record.student?.department || 'N/A',
      date: new Date(record.date).toLocaleDateString(),
      time: record.attendanceTime || 'N/A',
      subject: record.subject,
      class: record.class,
      status: record.status,
      teacher: record.teacher?.name || 'N/A',
      livenessVerified: record.livenessVerified ? 'Yes' : 'No',
    }));

    const csv = stringify(csvData, { header: true });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance_report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting attendance', error: error.message });
  }
};

// Get daily attendance summary
exports.getDailyAttendanceSummary = async (req, res) => {
  try {
    const { date, subject, class: className } = req.query;

    let query = {};

    if (date) {
      const checkDate = new Date(date);
      query.date = {
        $gte: new Date(checkDate.setHours(0, 0, 0, 0)),
        $lte: new Date(checkDate.setHours(23, 59, 59, 999)),
      };
    }

    if (subject) query.subject = subject;
    if (className) query.class = className;

    const attendance = await Attendance.find(query)
      .populate('student', 'name rollNumber email department')
      .populate('teacher', 'name employeeId');

    const summary = {
      totalRecords: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length,
      livenessVerified: attendance.filter(a => a.livenessVerified).length,
      records: attendance,
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance summary', error: error.message });
  }
};
