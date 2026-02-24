const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new student
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, enrollmentNumber, department, semester, phoneNumber, password } = req.body;

    // Check if student already exists
    let student = await Student.findOne({ $or: [{ email }, { rollNumber }] });
    if (student) {
      return res.status(400).json({ message: 'Student already registered with this email or roll number' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    student = new Student({
      name,
      email,
      rollNumber,
      enrollmentNumber,
      department,
      semester,
      phoneNumber,
      password: hashedPassword,
    });

    await student.save();

    // Create JWT token
    const token = jwt.sign(
      { studentId: student._id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Student registered successfully',
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering student', error: error.message });
  }
};

// Login student
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { studentId: student._id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Add face embedding
exports.addFaceEmbedding = async (req, res) => {
  try {
    const { studentId, embedding, imageBase64 } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!Array.isArray(student.faceEmbeddings)) {
      student.faceEmbeddings = [];
    }

    student.faceEmbeddings.push(embedding);
    student.lastFaceCapture = new Date();
    student.totalFaceCaptures = (student.totalFaceCaptures || 0) + 1;

    if (imageBase64) {
      student.faceImage = imageBase64;
    }

    await student.save();

    res.json({
      message: 'Face embedding added successfully',
      totalCaptures: student.totalFaceCaptures,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding face embedding', error: error.message });
  }
};

// Get student profile
exports.getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).select('-password -faceEmbeddings');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student profile', error: error.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true }).select('-password -faceEmbeddings');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

// Get students by department
exports.getStudentsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const students = await Student.find({ department, isActive: true }).select('-password -faceEmbeddings');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};
