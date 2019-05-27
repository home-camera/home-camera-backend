var refreshTokens = {};

module.exports = {
  // POST /api/auth/login
  login: async function(req, res) {
    if (req.body.email === null || req.body.email === '' ||
        req.body.password === null || req.body.password === '') {
      return res.sendStatus(400); // Bad Request
    }
    var user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.sendStatus(401); // Unauthorized
    }
    CipherService.comparePassword(req.body.password, user.encryptedPassword, (match) => {
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
    var refreshToken = req.body.token;
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
    var refreshToken = req.body.token;
    if(refreshToken in refreshTokens) {
      refreshTokens = {}; // revoke all tokens
      return res.sendStatus(200);
    } else {
      return res.sendStatus(401);
    }
  },
  // POST /api/auth/logout
  logout: function(req, res) {
    TokenService.blacklistToken(req.token, function() {
      return res.sendStatus(200);
    });
  }
};
