const mongoose = require("mongoose");
const User = require("./User");

const StudentSchema = new mongoose.Schema({
  roll_no: {
    type: String,
    unique: true,
    require: true,
    required: [true, "Please provide a roll no."],
    minLength: 3,
    maxLength: 15,
  },
  year: {
    type: String,
    require: true,
    required: [true, "Please provide a year"],
    enum: ["FY", "SY", "TY", "LY"],
  },
  branch: {
    type: String,
    require: true,
    required: [true, "Please provide a branch"],
    enum: ["COMPS", "EXTC", "IT", "MECH", "ETRX"],
  },
  division: {
    type: String,
    require: true,
    required: [true, "Please provide a division"],
  },
  role: {
    type: String,
    enum: ["college", "recruiter", "student"],
    default: "student",
  },
  semesters: [
    {
      certificate_hash: String,
      certificate_url: String,
      semester_number: Number,
      cxg: Number,
      credits: Number,
    },
  ],
  cv_url: {
    type: String,
  },
  current_cgpa: {
    type: Number,
  },

  // other student-specific fields
});

const Student = User.discriminator("Student", StudentSchema);

module.exports = Student;
