module.exports = {
  login: function(user, res) {
    TokenService.createToken({ 'user': user }, (err, token) => {
      if (err) {
        return res.sendStatus(500);
      }
      res.set('Authorization', 'Bearer ' + token);
      res.set('expires_in', sails.config.jwt.expiresIn);
      //res.cookie('access_token', token, { httpOnly: true, secure: true });
      //res.cookie('expires_in', sails.config.jwt.expiresIn, { httpOnly: true, secure: true });
      return res.sendStatus(200);
    });
  },
  logout: function(req, res) {
    TokenService.blacklistToken(req.token, function() {
      return res.sendStatus(200);
    });
  },
  isAuthenticated: function(req, done) {
    var bearer = req.header('Authorization');
    if (bearer) {
      var token = bearer.split(' ')[1];
      TokenService.verifyToken(token, (err, decoded) => {
        if (err) {
          done(false);
          return;
        }
        req.me = decoded.user;
        req.token = token;
        done(true);
      });
    } else {
      done(false);
    }
  },
  refreshAuth: function(req, res, done) {
    TokenService.blacklistToken(req.token, () => {
      TokenService.createToken({ 'user': req.me }, (error, newToken) => {
        if (error) {
          done(true);
          return;
        }
        res.set('Authorization', 'Bearer ' + newToken);
        res.set('expires_in', sails.config.jwt.expiresIn);
        req.token = newToken;
        //res.cookie('access_token', newToken, { httpOnly: true, secure: true, overwrite: true });
        //res.cookie('expires_in', sails.config.jwt.expiresIn, { httpOnly: true, secure: true, overwrite: true });
        done(false);
      });
    });
  }
};
