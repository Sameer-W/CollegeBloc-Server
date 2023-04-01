const express = require("express");
const router = express.Router();

const multer = require("multer");

const memoryStorage = multer.memoryStorage();
const uploadCertificateUsingMulter = multer({ storage: memoryStorage }).single(
  "certificate"
);
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadXlUsingMulter = multer({ storage: diskStorage }).single("file");

const {
  getAllStudents,
  myProfile,
  getStudent,
  uploadCertificate,
  bulkImportStudents,
} = require("../controllers/studentController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");

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

router.route("/:id").get(authenticateUser, getStudent);

router
  .route("/:id/uploadCertificate")
  .post(
    authenticateUser,
    authorizeRoles("college"),
    uploadCertificateUsingMulter,
    uploadCertificate
  );

module.exports = router;
