const express = require("express");
const router = express.Router();

const { registerStudent } = require("../controllers/collegeController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");

router.post(
  "/registerStudent",
  authenticateUser,
  authorizeRoles("college"),
  registerStudent
);

module.exports = router;
