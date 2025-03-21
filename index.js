const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const AttendanceRecord = require('./models/AttendanceRecord');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes

// Get all attendance records for a specific date, month, year, and type
app.get('/api/attendance', async (req, res) => {
  const { date, month, year, type } = req.query;

  try {
    // Validate input parameters
    if (!date || !month || !year || !type) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Fetch records for the specific date, month, year, and type
    const records = await AttendanceRecord.find({
      date: parseInt(date),
      month: parseInt(month),
      year: parseInt(year),
      type,
    });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new attendance record
app.post('/api/attendance', async (req, res) => {
  const { type, name, rollNo, empId, academicYear, designation, present, date, month, year } = req.body;

  try {
    // Validate required fields
    if (!type || !name || !date || !month || !year) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate identifier based on type
    if (type === 'student' && !rollNo) {
      return res.status(400).json({ message: 'Roll No is required for students' });
    }
    if (type === 'staff' && !empId) {
      return res.status(400).json({ message: 'Employee ID is required for staff' });
    }

    // Create new record
    const record = new AttendanceRecord({
      type,
      name,
      rollNo: type === 'student' ? rollNo : undefined, // Only for students
      empId: type === 'staff' ? empId : undefined, // Only for staff
      academicYear: type === 'student' ? academicYear : undefined, // Only for students
      designation: type === 'staff' ? designation : undefined, // Only for staff
      present: present || false, // Default to false if not provided
      date: parseInt(date),
      month: parseInt(month),
      year: parseInt(year),
    });

    // Save to database
    const newRecord = await record.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an attendance record
// Update an attendance record using academicYear and rollNo (for students) or empId (for staff)
app.patch('/api/attendance', async (req, res) => {
    const { type, academicYear, rollNo, empId, present } = req.body;
  
    try {
      // Validate required fields
      if (!type || !present) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      let query;
      if (type === 'student') {
        if (!academicYear || !rollNo) {
          return res.status(400).json({ message: 'Academic year and roll number are required for students' });
        }
        query = { type, academicYear, rollNo };
      } else if (type === 'staff') {
        if (!empId) {
          return res.status(400).json({ message: 'Employee ID is required for staff' });
        }
        query = { type, empId };
      } else {
        return res.status(400).json({ message: 'Invalid type' });
      }
  
      // Find and update the record
      const record = await AttendanceRecord.findOne(query);
      if (record) {
        record.present = present;
        const updatedRecord = await record.save();
        res.json(updatedRecord);
      } else {
        res.status(404).json({ message: 'Record not found' });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});