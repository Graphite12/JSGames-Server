const nodemailer = require("nodemailer");

require("dotenv").config();

module.exports = {
  sendMail: async (req, res) => {
    const mailTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // or 587
      service: "gmail",
      secure: true,
      auth: {
        type: "OAuth2",
        user: "elitebook855@gmail.com",
        clientId: process.env.MAILER_CLIENT_ID,
        clientSecret: process.env.MAILER_CLIENT_PWD,
        refreshToken: process.env.MAILER_REFTKN,
        accessToken: process.env.MAILER_ACCTKN,
        expires: 1484314697598,
      },
    });
    await mailTransporter.verify((err, success) => {
      if (err) {
        res.json({ message: err });
      } else {
        res.json({ message: success });
      }
    });

    let { name, email, subject, message } = req.body;
    console.log(req.body);
    let mailOption = {
      from: email,
      to: `elitebook855@gmail.com`,
      subject: subject,
      //   text: `name:${name}, email: ${email} message:${message}`,
      html: `
      <div>
       <h2>Contact Us</h2>
       <ul>
         <li>${name}</li>
         <li>${email}</li>
         <li>${subject}</li>
         <article>${message}</article>
       </ul>
      </div>`,
    };

    mailTransporter.sendMail(mailOption, (err, data) => {
      if (err) {
        res.status(400).send({
          status: "fail",
        });
      } else {
        res.status(200).send({
          status: "success" + data,
        });
      }
    });

    mailTransporter.close();
  },
};
