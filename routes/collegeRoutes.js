const express = require("express");
const router = express.Router();

const { registerStudent } = require("../controllers/collegeController");

router.post("/registerStudent", registerStudent);

module.exports = router;
