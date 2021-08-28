const nodemailer = require("nodemailer");
// const { google } = require("googleapis");
// const OAuth2 = google.auth.OAuth2;
require("dotenv").config();

// const createTransport = async () => {
//   const oauth2Client = new OAuth2(
//     process.env.MAILER_CLIENT_ID,
//     process.env.MAILER_CLIENT_PWD,
//     "https://developers.google.com/oauthplayground"
//   );

//   oauth2Client.setCredentials({
//     refresh_token: process.env.MAILER_REFTKN,
//   });

//   const accessToken = await new Promise((res, rej) => {
//     oauth2Client.getAccessToken((e, tkn) => {
//       if (e) {
//         rej("토큰 발행을 실패했습니다. :");
//       }
//       res(tkn);
//     });
//   });

//   const Transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465, // or 587
//     service: "gmail",
//     secure: true,
//     auth: {
//       type: "OAuth2",
//       user: "elitebook855@gmail.com",
//       clientId: process.env.MAILER_CLIENT_ID,
//       clientSecret: process.env.MAILER_CLIENT_PWD,
//       accessToken,
//       refreshToken: process.env.MAILER_REFTKN,
//       expires: 1484314697598,
//     },
//   });

//   return Transporter;
// };

module.exports = {
  mailerModule: async (req, res) => {
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
        accessToken: process.env.MAILER_ACCTKN,
        refreshToken: process.env.MAILER_REFTKN,
        expires: 1484314697598,
      },
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
         <li>Name: ${name}</li>
         <li>Email: ${email}</li>
         <li>Subject: ${subject}</li>
         <br/>
         <br/>
         <article>${message}</article>
       </ul>
      </div>`,
    };

    await mailTransporter.verify((err, success) => {
      if (err) {
        res.json({ message: err });
      } else {
        res.json({ message: `서버가 메세지를 전송할 수 있음.` });
      }
    });

    await mailTransporter.sendMail(mailOption, (err, res) => {
      if (err) {
        res.status(400).json({
          status: "Failed",
          code: 400,
          message: "메일 전송에 실패함",
        });
      } else {
        res.status(200).json({
          status: "Success",
          code: 200,
          message: "메일 전송에 성공함",
        });
      }
    });
    mailTransporter.close();
  },
};
