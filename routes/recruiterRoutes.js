const express = require("express");
const router = express.Router();

const {
  registerRecruiter,
  loginRecruiter,

  getAllRecruiters,
} = require("../controllers/recruiterController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");

router.post("/register", registerRecruiter);
router.post("/login", loginRecruiter);

router
  .route("/")
  .get(authenticateUser, authorizeRoles("college"), getAllRecruiters);

module.exports = router;
