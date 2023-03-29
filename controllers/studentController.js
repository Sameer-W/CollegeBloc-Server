const { StatusCodes } = require("http-status-codes");
const { token } = require("morgan");
const { UnauthenticatedError, BadRequestError } = require("../errors");
const Recruiter = require("../models/Recruiter");
const Student = require("../models/Student");

const { uploadToPinata } = require("../utils/ipfsConfig");

const xlsx = require("xlsx");

const { createJWT, attachCookiesToResponse } = require("../utils");
const checkPermissions = require("../utils/checkPermissions");
const createTokenUser = require("../utils/createTokenUser");

const getAllStudents = async (req, res) => {
  const { name, roll_no, div, branch, year } = req.query;
  const queryObject = {};

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (roll_no) {
    queryObject.roll_no = { $regex: roll_no, $options: "i" };
  }
  if (div) {
    queryObject.div = { $regex: div, $options: "i" };
  }
  if (branch) {
    queryObject.branch = { $regex: branch, $options: "i" };
  }
  if (year) {
    queryObject.year = { $regex: year, $options: "i" };
  }

  const students = await Student.find(queryObject)
    .sort({ roll_no: 1 })
    .select("-password");

  res.status(StatusCodes.OK).json({ length: students.length, students });
};

const getStudent = async (req, res) => {
  const student = await Student.findOne({ _id: req.params.id }).select(
    "-password"
  );

  if (!student) {
    throw new NotFoundError("User does not exist");
  }

  checkPermissions(req.user, student._id);

  res.status(StatusCodes.OK).json({ student });
};

const myProfile = async (req, res) => {
  const student = await Student.findOne({ _id: req.user.userId }).select(
    "-password"
  );

  res.status(StatusCodes.OK).json({ student });
};

const uploadCertificate = async (req, res) => {
  const { id } = req.params;

  const fileBuffer = req.file.buffer;
  const fileName = req.file.originalname;
  if (!fileBuffer || !fileName) {
    throw new BadRequestError("Please upload a pdf file with a valid name");
  }

  const cid = await uploadToPinata(fileBuffer, fileName);

  const updatedStudent = await Student.findByIdAndUpdate(
    { _id: id },
    {
      certificate_url: `https://ipfs.io/ipfs/${cid}`,
      certificate_hash: `${cid}`,
    },
    { new: true }
  ).select("-password");
  return res.json(updatedStudent);
};

const bulkImportStudents = async (req, res) => {
  //do not run this function yet testing remaining

  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames];
  const data = xlsx.utils.sheet_to_json(sheet);

  data.forEach((row) => {
    const student = new Student({
      name: row.name,
      email: row.email,
      password: row.password,
    });

    student.save();
  });

  res.send("File uploaded and accounts created successfully!");
};

module.exports = {
  getAllStudents,
  getStudent,
  myProfile,
  uploadCertificate,
  bulkImportStudents,
};
