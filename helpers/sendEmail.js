require("dotenv").config();
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRA_PASSWORD,
  },
});

function sendEmail(message) {
  message.from = "olegmalyshok@gmail.com";

  return transport.sendMail(message);
}

module.exports = sendEmail;
