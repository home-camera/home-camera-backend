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
      return res.sendStatus(401);
    }
    CipherService.comparePassword(params.password, user.encryptedPassword, (match) => {
      if (!match) {
        return res.sendStatus(401);
      }
      AuthService.login(user, res);
    });
  },
  // POST /api/auth/logout
  logout: function(req, res) {
    AuthService.logout(req, res);
  },
  // GET /api/auth/me
  me: function(req, res) {
    var user = req.me;
    if (user) {
      return res.status(200).json({ user: user });
    }
    return res.sendStatus(401);
  }
};
