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
  // POST /api/auth/token
  refreshToken: function(req, res) {
    if (!sails.config.auth.useRefreshTokens) {
      return res.sendStatus(401);
    }
    var params = req.parameters.permit('token').value();
    if (!params.hasOwnProperty('token')) {
      return res.sendStatus(400);
    }
    var refreshToken = params.token;
    if(refreshToken in refreshTokens) {
      TokenService.createToken({ user: refreshTokens[refreshToken] }, (err, token) => {
        if (err) {
          return res.sendStatus(500);
        }
        return res.json({'access_token': token});
      });
    } else {
      return res.sendStatus(401);
    }
  },
  // POST /api/auth/revoke
  revokeToken: function(req, res) {
    if (!sails.config.auth.useRefreshTokens) {
      return res.sendStatus(401);
    }
    var params = req.parameters.permit('token').value();
    if (!params.hasOwnProperty('token')) {
      return res.sendStatus(400);
    }
    var refreshToken = params.token;
    if(refreshToken in refreshTokens) {
      refreshTokens = {}; // revoke all tokens
      return res.sendStatus(200);
    } else {
      return res.sendStatus(401);
    }
  },
  // POST /api/auth/logout
  logout: function(req, res) {
    var params = req.parameters.permit('token').value();
    if (!params.hasOwnProperty('token')) {
      return res.sendStatus(400);
    }
    TokenService.blacklistToken(params.token, function() {
      return res.sendStatus(200);
    });
  }
};
