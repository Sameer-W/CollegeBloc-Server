const mongoose = require("mongoose");
const User = require("./User");

const CollegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },

  // other college-specific fields
});

const College = User.discriminator("College", CollegeSchema);

module.exports = College;
