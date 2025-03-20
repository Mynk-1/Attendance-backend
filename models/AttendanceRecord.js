const attendanceRecordSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ['student', 'staff'] 
  },
  rollNo: { 
    type: String, 
    required: function() { return this.type === 'student'; } 
  },
  empId: { 
    type: String, 
    required: function() { return this.type === 'staff'; } 
  },
  name: { 
    type: String, 
    required: true 
  },
  year: { 
    type: Number, 
    required: function() { return this.type === 'student'; } 
  },
  designation: { 
    type: String, 
    required: function() { return this.type === 'staff'; } 
  },
  present: { 
    type: Boolean, 
    default: false 
  },
  date: { 
    type: Date, 
    required: true 
  }
});