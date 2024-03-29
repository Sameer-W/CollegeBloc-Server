const { StatusCodes } = require("http-status-codes");
const { token } = require("morgan");
const {
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
} = require("../errors");

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
const pdf2img = require("pdf2img");

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

  let imagePath;
  if (!req.file) {
    throw new BadRequestError("Please input the CV file");
  }

  if (req.file.mimetype === "application/pdf") {
    pdf2img.convert(req.file.path, function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).send("Failed to convert PDF to PNG");
      }

      // Upload the first PNG image to Cloudinary
      console.log(result.outputFiles);
      imagePath = result.outputFiles[0];
    });
  } else {
    imagePath = req.file.path;
  }
  // imagePath = req.file.path;
  const cv_url = await uploadCVGetUrl(studentId, imagePath);

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
    const cxg = row["Total C X G"];
    const credits = row["Total Credits"];
    const student = await Student.findOne({ roll_no });
    let cgpa = row["SGPI"];
    if (!student) {
      rollDoesNotExist.push(roll_no);
      continue;
    }

    const semesterIndex = student.semesters.findIndex(
      (semester) => semester.semester_number === sem
    );

    if (semesterIndex !== -1) {
      // If the semester object already exists, replace it with the new values
      student.semesters.splice(semesterIndex, 1);
    }

    if (student.semesters.length !== 0) {
      let totalCredits = credits;
      let totalCreditPoints = cxg;
      for (const semester of student.semesters) {
        totalCredits += semester.credits;
        totalCreditPoints += semester.cxg;
      }

      // Calculate the global CGPA
      cgpa = totalCreditPoints / totalCredits;
    }
    const pythonProcess = spawn("python", [
      "./pyscript_certificate/scriptFinal.py",
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
        const currFile = path.join(src, `${roll_no}_${name}_Sem${sem}.pdf`);
        const cid = await uploadToPinata(currFile);

        // If the semester object does not exist, add it to the semesters array
        student.semesters.push({
          certificate_hash: `${cid}`,
          certificate_url: `https://ipfs.io/ipfs/${cid}`,
          semester_number: sem,
          cxg,
          credits,
        });

        student.current_cgpa = cgpa.toFixed(2) || 0;

        await student.save();

        console.log(`Certificate uploaded for roll no ${roll_no}`);
        resolve();
      });
    });
  }

  res.json({
    msg: "Certificates generation and upload completed",
    rollDoesNotExist,
  });
};

module.exports = {
  getAllStudents,
  getStudent,
  myProfile,
  uploadCertificate,
  bulkImportStudents,
  bulkUploadCertificates,
  uploadCV,
};
