var refreshTokens = {};

module.exports = {
	// POST /api/auth/login
  login: async function(req, res, next) {
    var user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.sendStatus(401);
    }
    if (CipherService.comparePassword(req.body.password, user.encrypted_password)) {
      res.set('Authorization', 'Bearer ' + TokenService.createToken(user));
      var refreshToken = TokenService.createRefreshToken();
      refreshTokens[refreshToken] = user;
      res.set('refresh-token', refreshToken);
      return res.sendStatus(200);
    }
    return res.sendStatus(401);
  },
  // POST /api/auth/token
  refreshToken: function(req, res, next) {
    var refreshToken = req.body.token;
    if(refreshToken in refreshTokens) {
      var token = TokenService.createToken(refreshTokens[refreshToken]);
      return res.json({"access_token": token})
    }
    else return res.sendStatus(401);
  },
  // POST /api/auth/revoke
  revokeToken: function(req, res, next) {
    var refreshToken = req.body.token;
    if(refreshToken in refreshTokens) {
      refreshTokens = {}; // revoke all tokens
      return res.sendStatus(200);
    }
    else return res.sendStatus(401);
  },
	// POST /api/auth/logout
	logout: function(req, res, next) {
		return res.sendStatus(501);
	}
};
