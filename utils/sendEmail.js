const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);

  let info = await transporter.sendMail({
    from: '"CollegeBloc" <collegebloc@gmail.com>',
    to,
    subject,
    html, // sender address
  });
};

module.exports = sendEmail;
