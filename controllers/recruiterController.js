const { StatusCodes } = require("http-status-codes");
const { token } = require("morgan");
const Recruiter = require("../models/Recruiter");

const { createJWT, attachCookiesToResponse } = require("../utils");
const createTokenUser = require("../utils/createTokenUser");
const { sendResetPasswordEmail } = require("../utils/sendResetPasswordEmail");

const registerRecruiter = async (req, res) => {
  const { email, password, name, location, description } = req.body;
  const recruiter = await Recruiter.create({
    email,
    password,
    name,
    role: "recruiter",
    location,
    description,
  });
  const tokenUser = createTokenUser(recruiter);

  attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.CREATED).json({ recruiter: tokenUser });
};

const loginRecruiter = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please enter email and password");
  }

  const user = await Recruiter.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse(res, tokenUser);
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

module.exports = { registerRecruiter, loginRecruiter };
