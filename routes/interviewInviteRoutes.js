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
  updateInterviewStatus,
} = require("../controllers/interviewInviteController");

router
  .route("/")
  .get(authenticateUser, authorizeRoles("college"), getAllInterviewInvites)
  .post(authenticateUser, authorizeRoles("recruiter"), createInterviewInvite);

router
  .route("/sentInvites")
  .get(
    authenticateUser,
    authorizeRoles("recruiter"),
    getInterviewInvitesOfCurrentRecruiter
  );

router
  .route("/:interviewInviteId")
  .get(
    authenticateUser,
    authorizeRoles("college", "recruiter"),
    getSingleInterviewInvite
  )
  .delete(authenticateUser, authorizeRoles("recruiter"), deleteInterviewInvite);

router
  .route("/:interviewInviteId/updateStatus")
  .post(authenticateUser, authorizeRoles("student"), updateInterviewStatus);

module.exports = router;
