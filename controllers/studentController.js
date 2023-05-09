const { StatusCodes } = require("http-status-codes");
const { token } = require("morgan");
const { UnauthenticatedError, BadRequestError } = require("../errors");

const Student = require("../models/Student");

const { uploadBufferToPinata, uploadToPinata } = require("../utils/ipfsConfig");

const xlsx = require("xlsx");
const crypto = require("crypto");
const checkPermissions = require("../utils/checkPermissions");

const { spawn } = require("child_process");
const path = require("path");
const generatePassword = require("generate-password");
const { sendGeneratedPassword } = require("../utils/sendResetPasswordEmail");
const { uploadCVGetUrl } = require("../utils/cloudinaryConfig");

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
  const { sem } = req.body;

  if (!sem) {
    throw new BadRequestError("Please enter semester.");
  }

  const fileBuffer = req.file.buffer;
  const fileName = req.file.originalname;
  if (!fileBuffer || !fileName) {
    throw new BadRequestError("Please upload a pdf file with a valid name");
  }

  const cid = await uploadBufferToPinata(fileBuffer, fileName);

  let updatedStudent = await Student.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        semesters: {
          certificate_hash: `${cid}`,
          certificate_url: `https://ipfs.io/ipfs/${cid}`,
          semester_number: parseInt(sem),
        },
      },
    },
    { new: true }
  ).select("-password");

  return res.json(updatedStudent);
};

const uploadCV = async (req, res) => {
  const studentId = req.user.userId;

  if (!req.file) {
    throw new BadRequestError("Please input the CV file");
  }

  const cv_url = await uploadCVGetUrl(studentId, req.file);

  let updatedStudent = await Student.findOneAndUpdate(
    { _id: studentId },
    { cv_url },
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

  for (const row of data) {
    const tempStu = await Student.findOne({ email: row.email });

    if (tempStu) {
      continue;
    }

    const password = generatePassword.generate({
      length: 8,
      numbers: true,
      symbols: false,
      uppercase: true,
      lowercase: true,
    });

    const student = new Student({
      name: row.name,
      email: row.email,
      password: password,
      roll_no: row.roll_no,
      year: row.year,
      branch: row.branch,
      division: row.division,
      role: "student",
    });

    const passwordToken = crypto.randomBytes(32).toString("hex");

    const origin = "http://localhost:3000";

    await sendGeneratedPassword({
      name: student.name,
      email: student.email,
      token: passwordToken,
      origin,
      currPassword: password,
    });

    const tenMin = 1000 * 60 * 10;

    const passwordTokenExpirationDate = new Date(Date.now() + tenMin);

    student.passwordToken = passwordToken;
    student.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await student.save();
  }

  res.send("File uploaded, mails sent and accounts created successfully!");
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
        // let updatedStudent;
        // const existingSemester = await Student.findOne({
        //   roll_no,
        //   semesters: { $elemMatch: { sem } },
        // }).select("semesters");

        // if (existingSemester) {
        //   updatedStudent = await Student.findOneAndUpdate(
        //     { roll_no, "semesters.semester_number": sem },
        //     {
        //       $set: {
        //         "semesters.$": {
        //           certificate_hash: `${cid}`,
        //           certificate_url: `https://ipfs.io/ipfs/${cid}`,
        //           semester_number: sem,
        //         },
        //       },
        //     },
        //     { new: true }
        //   );
        // } else {
        let updatedStudent = await Student.findOneAndUpdate(
          { roll_no },
          {
            $push: {
              semesters: {
                certificate_hash: `${cid}`,
                certificate_url: `https://ipfs.io/ipfs/${cid}`,
                semester_number: sem,
              },
            },
          },
          { new: true }
        );
        //}

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
  uploadCV,
};
