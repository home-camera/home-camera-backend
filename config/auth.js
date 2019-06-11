module.exports.auth = {
  confirmationTokenBytes: 128,
  password: {
    length: [8, 128],
    saltLength: 12,
    resetExpireTime: 600 // seconds (10minutes)
  },
  resetPasswordRedirectUri: process.env.RESET_PASSWORD_REDIRECT_URI
};
