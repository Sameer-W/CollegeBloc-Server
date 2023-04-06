const { StatusCodes } = require("http-status-codes");
const { token } = require("morgan");
const { UnauthenticatedError, BadRequestError } = require("../errors");
const Recruiter = require("../models/Recruiter");
const Student = require("../models/Student");

const { uploadBufferToPinata, uploadToPinata } = require("../utils/ipfsConfig");

const xlsx = require("xlsx");

const { createJWT, attachCookiesToResponse } = require("../utils");
const checkPermissions = require("../utils/checkPermissions");
const createTokenUser = require("../utils/createTokenUser");

const pandas = require("node-pandas");

const { spawn } = require("child_process");
const path = require("path");

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

  const cid = await uploadBufferToPinata(fileBuffer, fileName);

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

  console.log(data);
  data.forEach((row) => {
    const student = new Student({
      name: row.name,
      email: row.email,
      password: row.password,
      roll_no: row.roll_no,
      year: row.year,
      branch: row.branch,
      division: row.division,
      role: "student",
    });

    console.log(student);
    student.save();
  });

  res.send("File uploaded and accounts created successfully!");
};

const bulkUploadCertificates = async (req, res) => {
  const pythonScriptPath = path.join(
    __dirname,
    "pyscript_certificate/scriptNew.py"
  );
  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames];
  const rows = xlsx.utils.sheet_to_json(sheet);
  const rollDoesNotExist = [];
  const src = path.join(__dirname, "..", "pyscript_certificate", "results");

  for await (const row of rows) {
    const roll_no = row["Roll No"];
    const name = row["Name"];
    const sem = row["Sem"];

    const student = await Student.findOne({ roll_no });

    if (!student) {
      rollDoesNotExist.push(roll_no);
      continue;
    }

    const pythonProcess = spawn("python", [
      "./pyscript_certificate/scriptNew.py",
    ]);

    await new Promise((resolve, reject) => {
      pythonProcess.stdin.write(JSON.stringify({ ...row }));
      pythonProcess.stdin.end();

      pythonProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
        reject();
      });

      pythonProcess.on("close", async (code) => {
        console.log(`child process exited with code ${code}`);
        const currFile = path.join(src, `${roll_no}_${name}.pdf`);
        const cid = await uploadToPinata(currFile);
        await Student.findOneAndUpdate(
          { roll_no: roll_no },
          {
            certificate_url: `https://ipfs.io/ipfs/${cid}`,
            certificate_hash: `${cid}`,
          }
        );
        console.log(`Certificate uploaded for roll no ${roll_no}`);
        resolve();
      });
    });
  }

  res.send("Certificates generation and upload completed");
};

// const bulkUploadCertificates = async (req, res) => {

//   const workbook = xlsx.readFile(req.file.path);
//   const sheet = workbook.Sheets[workbook.SheetNames];
//   const rows = xlsx.utils.sheet_to_json(sheet);
//   const rollDoesNotExist = [];

//   rows.forEach(async (row) => {
//     const roll_no = row["Roll No"];

//     const student = await Student.findOne({ roll_no });

//     if (!student) {
//       rollDoesNotExist.push(roll_no);
//       return;
//     }

//     // console.log(JSON.stringify({ ...row }));

//     const pythonProcess = spawn("python", [
//       "./pyscript_certificate/scriptNew.py",
//     ]);

//     pythonProcess.stdin.write(JSON.stringify({ ...row }));
//     pythonProcess.stdin.end();

//     pythonProcess.stdout.on("data", (data) => {
//       console.log(`stdout: ${data}`);
//     });

//     pythonProcess.stderr.on("data", (data) => {
//       console.error(`stderr: ${data}`);
//     });

//     pythonProcess.on("close", (code) => {
//       console.log(`child process exited with code ${code}`);
//     });
//   });

//   res.send("Certificates generation started");
// };

module.exports = {
  getAllStudents,
  getStudent,
  myProfile,
  uploadCertificate,
  bulkImportStudents,
  bulkUploadCertificates,
};