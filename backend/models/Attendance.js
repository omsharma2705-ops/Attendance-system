const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    default: 'absent',
  },
  faceConfidence: {
    type: Number,
    min: 0,
    max: 1,
  },
  livenessVerified: {
    type: Boolean,
    default: false,
  },
  attendanceTime: {
    type: Time,
    type: String,
  },
  remarks: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
