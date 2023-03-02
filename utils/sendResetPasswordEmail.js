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

module.exports = { sendResetPasswordEmail };
