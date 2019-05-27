const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport(sails.config.email);

module.exports = {
  sendMail: function(mailOptions, done) {
    mailOptions.from = process.env.SMTP_USER;
    transporter.sendMail(mailOptions, done);
  }
};
