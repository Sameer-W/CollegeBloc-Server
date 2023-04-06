const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");
const {
  getAllInterviewInvites,
  getSingleInterviewInvite,
  deleteInterviewInvite,
  createInterviewInvite,
  getInterviewInvitesOfCurrentRecruiter,
} = require("../controllers/interviewInviteController");

router
  .route("/")
  .get(authenticateUser, authorizeRoles("college"), getAllInterviewInvites)
  .get(
    authenticateUser,
    authorizeRoles("recruiter"),
    getInterviewInvitesOfCurrentRecruiter
  )
  .post(authenticateUser, authorizeRoles("recruiter"), createInterviewInvite);

router
  .route("/:interviewInviteId")
  .get(
    authenticateUser,
    authorizeRoles("college", "recruiter"),
    getSingleInterviewInvite
  )
  .delete(authenticateUser, authorizeRoles("recruiter"), deleteInterviewInvite);

module.exports = router;
