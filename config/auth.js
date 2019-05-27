module.exports.auth = {
  refreshTokenBytes: 64,
  confirmationTokenBytes: 128,
  password: {
    length: [8, 128],
    saltLength: 12,
    resetExpireTime: 600 // seconds (10minutes)
  },
  resetPasswordRedirectUri: '',
  useRefreshTokens: false
};
