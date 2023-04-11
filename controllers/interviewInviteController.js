const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const InterviewInvite = require("../models/InterviewInvite");
const Student = require("../models/Student");
const checkPermissions = require("../utils/checkPermissions");

const createInterviewInvite = async (req, res) => {
  const { studentId } = req.body;

  const isValidStudent = await Student.findOne({ _id: studentId });

  if (!isValidStudent) {
    throw new NotFoundError(`No student with id : ${studentId}`);
  }

  //   const alreadySubmitted = await InterviewInvite.findOne({
  //     studentId,
  //     recruiterId: req.user.userId,
  //   });

  //   if (alreadySubmitted) {
  //     throw new BadRequestError("Already submitted invite to this student");
  //   }

  req.body.recruiterId = req.user.userId;
  const interviewInvite = await InterviewInvite.create(req.body);
  res.status(StatusCodes.CREATED).json({ interviewInvite });
};

const getAllInterviewInvites = async (req, res) => {
  const interviewInvites = await InterviewInvite.find({})
    .populate({
      path: "studentId",
      select: "name roll_no branch",
    })
    .populate({
      path: "recruiterId",
      select: "name",
    });

  res
    .status(StatusCodes.OK)
    .json({ interviewInvites, count: interviewInvites.length });
};

const getInterviewInvitesOfCurrentRecruiter = async (req, res) => {
  const recruiterId = req.user.userId;

  const interviewInvites = await InterviewInvite.find({ recruiterId }).populate(
    { path: "studentId", select: "name roll_no branch" }
  );

  res
    .status(StatusCodes.OK)
    .json({ interviewInvites, count: interviewInvites.length });
};

const getSingleInterviewInvite = async (req, res) => {
  const { interviewInviteId } = req.params;

  const interviewInvite = await InterviewInvite.findOne({
    _id: interviewInviteId,
  });

  if (!interviewInvite) {
    throw new CustomError.NotFoundError(
      `No interview invite with id ${interviewInviteId}`
    );
  }

  res.status(StatusCodes.OK).json({ interviewInvite });
};

const deleteInterviewInvite = async (req, res) => {
  const { interviewInviteId } = req.params;

  const interviewInvite = await InterviewInvite.findOne({
    _id: interviewInviteId,
  });

  if (!interviewInvite) {
    throw new CustomError.NotFoundError(
      `No interviewInvite with id ${interviewInviteId}`
    );
  }

  checkPermissions(req.user, interviewInvite.recruiterId);
  await interviewInvite.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! interviewInvite removed" });
};

const getSingleStudentInterviewInvites = async (req, res) => {
  const { studentId } = req.params;
  const interviewInvites = await InterviewInvite.find({ studentId });
  res
    .status(StatusCodes.OK)
    .json({ interviewInvites, count: interviewInvites.length });
};

const updateInterviewStatus = async (req, res) => {
  const { interviewInviteId } = req.params;
  const { status } = req.body;

  const interviewInvite = await InterviewInvite.findOne({
    id: interviewInviteId,
  });

  if (!interviewInvite) {
    throw new NotFoundError("No interviewInvite found with the id");
  }

  checkPermissions(req.user, interviewInvite.studentId);

  interviewInvite.status = status;

  await interviewInvite.save();

  res.status(StatusCodes.ACCEPTED).json(interviewInvite);
};

module.exports = {
  createInterviewInvite,
  getAllInterviewInvites,
  getInterviewInvitesOfCurrentRecruiter,
  getSingleInterviewInvite,
  deleteInterviewInvite,
  getSingleStudentInterviewInvites,
  updateInterviewStatus,
};
