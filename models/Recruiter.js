const mongoose = require("mongoose");
const User = require("./User");

const RecruiterSchema = new mongoose.Schema({
  location: { type: String, required: true },
  description: { type: String, required: true },
  role: {
    type: String,
    enum: ["college", "recruiter", "student"],
    default: "recruiter",
  },
  // other recruiter-specific fields
});

const Recruiter = User.discriminator("Recruiter", RecruiterSchema);

module.exports = Recruiter;
