const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    var html="To reset your password, click this <a href='" + text + "'><span>link</span></a>.<br>This is a <b>test</b> email."
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port:465,
            auth: {
                user: "collegebloc@gmail.com",
                pass: "fgaenxsyeiytfhsj",
            },
            // tls: {
            //     rejectUnauthorized: false,
            // }
            secure:true,
        });

    //     await transporter.sendMail({
    //         from: "collegebloc@gmail.com",
    //         to: email,
    //         subject: subject,
    //         text: text,
    //     });

    //     console.log("email sent sucessfully");
    const mailData = {
        from: "collegebloc@gmail.com", // sender address
        to: email, // list of receivers
        subject: subject,
        html: html,
      };
      transporter.sendMail(mailData, function (err, info) {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: err });
        } else console.log(info);
      });
    } catch (error) {
        console.log(error, "email not sent");
    }

    
};

module.exports = sendEmail;