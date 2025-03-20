const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['student', 'staff'] }, // student or staff
  name: { type: String, required: true }, // Name of the student/staff
  rollNo: { type: String }, // Roll number for students
  empId: { type: String }, // Employee ID for staff
  academicYear: { type: Number }, // Academic year for students (1, 2, 3, 4)
  designation: { type: String }, // Designation for staff
  present: { type: Boolean, default: false }, // Attendance status
  date: { type: Number, required: true }, // Day of the month (1-31)
  month: { type: Number, required: true }, // Month (1-12)
  year: { type: Number, required: true }, // Full year (e.g., 2023)
});

module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);