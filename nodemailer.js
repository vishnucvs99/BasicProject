var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "noreply.covalenseglobal@gmail.com",
      pass: "hije oecw vdvu xiwv",
    },
  });

  module.exports = { transporter,};