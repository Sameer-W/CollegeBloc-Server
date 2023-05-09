const express = require("express");
const router = express.Router();

const {
  uploadCVUsingMulter,
  uploadXlUsingMulter,
  uploadCertificateUsingMulter,
} = require("../utils/multerConfig");

const {
  getAllStudents,
  myProfile,
  getStudent,
  uploadCertificate,
  bulkImportStudents,
  bulkUploadCertificates,
  uploadCV,
} = require("../controllers/studentController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");
const {
  getSingleStudentInterviewInvites,
} = require("../controllers/interviewInviteController");

router
  .route("/")
  .get(
    authenticateUser,
    authorizeRoles("recruiter", "college"),
    getAllStudents
  );

router
  .route("/myProfile")
  .get(authenticateUser, authorizeRoles("student"), myProfile);

router
  .route("/bulkImportStudents")
  .post(
    authenticateUser,
    authorizeRoles("college"),
    uploadXlUsingMulter,
    bulkImportStudents
  );

router
  .route("/bulkUploadCertificates")
  .post(
    authenticateUser,
    authorizeRoles("college"),
    uploadXlUsingMulter,
    bulkUploadCertificates
  );

router
  .route("/uploadCV")
  .post(
    authenticateUser,
    authorizeRoles("student"),
    uploadCVUsingMulter,
    uploadCV
  );

router.route("/:id").get(authenticateUser, getStudent);

router
  .route("/:studentId/invites")
  .get(
    authenticateUser,
    authorizeRoles("college", "student"),
    getSingleStudentInterviewInvites
  );

router
  .route("/:id/uploadCertificate")
  .post(
    authenticateUser,
    authorizeRoles("college"),
    uploadCertificateUsingMulter,
    uploadCertificate
  );

module.exports = router;
