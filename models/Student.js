const mongoose = require("mongoose");
const User = require("./User");

const StudentSchema = new mongoose.Schema({
  roll_no: {
    type: String,
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
  certificate_hash: {
    type: String,
  },
  certificate_url: {
    type: String,
  },
  // other student-specific fields
});

const Student = User.discriminator("Student", StudentSchema);

module.exports = Student;
