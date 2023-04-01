const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const NotFoundError = require("../errors/not-found");
const User = require("../models/User");
const { attachCookiesToResponse } = require("../utils");
const checkPermissions = require("../utils/checkPermissions");
const createTokenUser = require("../utils/createTokenUser");

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");

  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");

  if (!user) {
    throw new NotFoundError("User does not exist");
  }

  checkPermissions(req.user, user._id);

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;

  if (!email || !name) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOneAndUpdate(
    {
      _id: req.user.userId,
    },
    { email, name },
    { new: true, runValidators: true }
  );

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse(res, tokenUser);
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Please provide both values");
  }

  const user = await User.findOne({ _id: req.user.userId });

  const isOldPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isOldPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
