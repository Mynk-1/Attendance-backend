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

// Get all attendance records for a specific date and type (student or staff)
app.get('/api/attendance', async (req, res) => {
    const { date, type } = req.query;
    try {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0); // Start of day in UTC
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999); // End of day in UTC
  
      const records = await AttendanceRecord.find({
        date: { $gte: startOfDay, $lte: endOfDay },
        type,
      });
      res.json(records);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Add a new attendance record (for student or staff)
app.post('/api/attendance', async (req, res) => {
  const { type, rollNo, empId, name, year, designation, present, date } = req.body;
  const record = new AttendanceRecord({ type, rollNo, empId, name, year, designation, present, date: new Date(date) });
  try {
    const newRecord = await record.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an attendance record (for student or staff)
app.patch('/api/attendance/:id', async (req, res) => {
  try {
    const record = await AttendanceRecord.findById(req.params.id);
    if (record) {
      record.present = req.body.present;
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