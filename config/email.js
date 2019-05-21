module.exports.email = {
  service: 'Gmail',
  auth: { user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD },
  testMode: true
};
