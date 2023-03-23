const { StatusCodes } = require("http-status-codes");
const { token } = require("morgan");
const Student = require("../models/Student");

const { createJWT, attachCookiesToResponse } = require("../utils");
const createTokenUser = require("../utils/createTokenUser");
const { sendResetPasswordEmail } = require("../utils/sendResetPasswordEmail");

const registerStudent = async (req, res) => {
  const { email, password, name, roll_no, year, branch, division } = req.body;
  const student = await Student.create({
    email,
    password,
    name,
    role: "student",
    roll_no,
    year,
    branch,
    division,
  });
  const tokenUser = createTokenUser(student);

  //attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.CREATED).json({ student: tokenUser });
};

module.exports = { registerStudent };
