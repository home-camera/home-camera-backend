module.exports = {
  login: function(user, res) {
    TokenService.createToken({ 'user': user }, (err, token) => {
      if (err) {
        return res.sendStatus(500);
      }
      //res.set('Authorization', 'Bearer ' + token);
      //res.set('expires_in', sails.config.jwt.expiresIn);
      var expiration = sails.config.jwt.expiresIn;
      var options = sails.config.cookies;
      options.maxAge = expiration;
      options.expires = new Date(Date.now() + expiration);
      res.cookie('access_token', token, options);
      res.cookie('expires_in', expiration, options);
      return res.sendStatus(200);
    });
  },
  logout: function(req, res) {
    TokenService.blacklistToken(req.token, function() {
      return res.sendStatus(200);
    });
  },
  isAuthenticated: function(req, done) {
    //var bearer = req.header('Authorization');
    //if (bearer) {
      //var token = bearer.split(' ')[1];
    var token = req.signedCookies['access_token'];
    if (token) {
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
        //res.set('Authorization', 'Bearer ' + newToken);
        //res.set('expires_in', sails.config.jwt.expiresIn);
        req.token = newToken;
        var expiration = sails.config.jwt.expiresIn;
        var options = sails.config.cookies;
        options.maxAge = expiration;
        options.expires = new Date(Date.now() + expiration);
        options.overwrite = true;
        res.cookie('access_token', newToken, options);
        res.cookie('expires_in', expiration, options);
        done(false);
      });
    });
  }
};
