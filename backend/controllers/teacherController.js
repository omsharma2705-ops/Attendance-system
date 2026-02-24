const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new teacher
exports.registerTeacher = async (req, res) => {
  try {
    const { name, email, employeeId, department, phoneNumber, password, subjects, classes } = req.body;

    // Check if teacher already exists
    let teacher = await Teacher.findOne({ $or: [{ email }, { employeeId }] });
    if (teacher) {
      return res.status(400).json({ message: 'Teacher already registered with this email or employee ID' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    teacher = new Teacher({
      name,
      email,
      employeeId,
      department,
      phoneNumber,
      password: hashedPassword,
      subjects: subjects || [],
      classes: classes || [],
    });

    await teacher.save();

    const token = jwt.sign(
      { teacherId: teacher._id, email: teacher.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Teacher registered successfully',
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        employeeId: teacher.employeeId,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering teacher', error: error.message });
  }
};

// Login teacher
exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { teacherId: teacher._id, email: teacher.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        employeeId: teacher.employeeId,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get teacher profile
exports.getTeacherProfile = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const teacher = await Teacher.findById(teacherId).select('-password');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher profile', error: error.message });
  }
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ isActive: true }).select('-password');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
  }
};
