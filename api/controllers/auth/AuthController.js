var refreshTokens = {};

module.exports = {
  // POST /api/auth/login
  login: async function(req, res) {
    var params = req.parameters.permit('email', 'password').value();
    if (!(params.hasOwnProperty('email') && params.hasOwnProperty('password'))) {
      return res.sendStatus(400);
    }
    var user = await User.findOne({ email: params.email });
    if (!user) {
      return res.sendStatus(401); // Unauthorized
    }
    CipherService.comparePassword(params.password, user.encryptedPassword, (match) => {
      if (!match) {
        return res.sendStatus(401);
      }

      TokenService.createToken({ 'user': user }, (err, token) => {
        if (err) {
          return res.sendStatus(500);
        }
        res.set('Authorization', 'Bearer ' + token);
        if (!sails.config.auth.useRefreshTokens) {
          return res.sendStatus(200);
        }
        TokenService.createRefreshToken((err, refreshToken) => {
          if (err) {
            return res.sendStatus(500);
          }
          refreshTokens[refreshToken] = user;
          res.set('refresh-token', refreshToken);
          return res.sendStatus(200);
        });
      });
    });
  },
  // POST /api/auth/logout
  logout: function(req, res) {
    TokenService.blacklistToken(req.token, function() {
      return res.sendStatus(200);
    });
  },
  status: function(req, res, next) {
    return res.sendStatus(200);
  }
};
