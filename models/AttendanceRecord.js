const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['student', 'staff'] }, // To differentiate between student and staff
  rollNo: { type: String }, // For students
  empId: { type: String }, // For staff
  name: { type: String, required: true },
  year: { type: Number }, // For students
  designation: { type: String }, // For staff
  present: { type: Boolean, default: false },
  date: { type: Date, required: true } // Date of attendance
});

module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);