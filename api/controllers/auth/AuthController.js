var refreshTokens = {};

module.exports = {
  // POST /api/auth/login
  login: async function(req, res) {
    var user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.sendStatus(401); // Unauthorized
    }
    if (!user.isActive) {
      return res.status(403).json({ error: 'user must be activated first' }); // Forbidden
    }
    CipherService.comparePassword(req.body.password, user.encryptedPassword, function(match) {
      if (!match) {
        return res.sendStatus(401);
      }

      TokenService.createToken({ 'user': user }, function(err, token) {
        if (err) {
          return res.sendStatus(500);
        }
        res.set('Authorization', 'Bearer ' + token);
        TokenService.createRefreshToken(function(err, refreshToken) {
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
    var refreshToken = req.body.token;
    if(refreshToken in refreshTokens) {
      TokenService.createToken({ user: refreshTokens[refreshToken] },
                      function(err, token) {
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
    return res.sendStatus(501);
  }
};
