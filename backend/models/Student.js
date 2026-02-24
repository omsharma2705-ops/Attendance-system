const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  enrollmentNumber: {
    type: String,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  faceEmbeddings: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  faceImage: {
    type: String,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  lastFaceCapture: {
    type: Date,
  },
  totalFaceCaptures: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
