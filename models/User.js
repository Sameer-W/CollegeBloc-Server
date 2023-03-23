const { string } = require("joi");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["college", "recruiter", "student"],
      default: "student",
    },

    passwordToken: {
      type: String,
    },

    passwordTokenExpirationDate: {
      type: Date,
    },
  },
  { discriminatorKey: "__t" }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
