const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;

  const html = `<p>Please reset the password by clicking on the following link : <a href="${resetURL}">Reset Password</a></p>`;

  await sendEmail({
    to: email,
    subject: "Password Reset",
    html: `<h4>Hello ${name}</h4>
    ${html}
    `,
  });
};

const sendGeneratedPassword = async ({
  name,
  email,
  token,
  origin,
  currPassword,
}) => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;

  const html = `<p>Your account has been created on CollegeBloc with the password <b>${currPassword}</b>. If you would like to reset the password, please click on the following link : <a href="${resetURL}">Reset Password</a></p>`;

  await sendEmail({
    to: email,
    subject: "Welcome to CollegeBloc",
    html: `<h4>Hello ${name}</h4>
    ${html}
    `,
  });
};

module.exports = { sendResetPasswordEmail, sendGeneratedPassword };
