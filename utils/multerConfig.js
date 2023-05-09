const multer = require("multer");

const memoryStorage = multer.memoryStorage();
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadCertificateUsingMulter = multer({ storage: memoryStorage }).single(
  "certificate"
);
const uploadXlUsingMulter = multer({ storage: diskStorage }).single("file");
const uploadCVUsingMulter = multer({ storage: diskStorage }).single("cv");

module.exports = {
  uploadCVUsingMulter,
  uploadCertificateUsingMulter,
  uploadXlUsingMulter,
};
