const moment = require('moment');

module.exports = {
  login: function(user, res, done) {
    TokenService.createToken({ 'user': user }, (err, token) => {
      if (err) {
        done(true);
        return;
      }
      //res.set('Authorization', 'Bearer ' + token);
      //res.set('expires_in', sails.config.jwt.expiresIn);
      const expiresIn = sails.config.jwt.expiresIn * 1000;
      const expiration = new Date(Date.now() + expiresIn);
      const options = { maxAge: expiresIn, expires: expiration, encode: String };
      const secureOptions = Object.assign({}, sails.config.cookies.secure, options);
      res.cookie('access_token', token, secureOptions);
      res.cookie('expiration', expiration.toUTCString(), options);
      console.log(expiration.toUTCString());
      done(false);
    });
  },
  logout: function(req, res) {
    TokenService.blacklistToken(req.token, function() {
      res.clearCookie('access_token');
      res.clearCookie('expiration');
      return res.sendStatus(200);
    });
  },
  isAuthenticated: function(req, done) {
    //var bearer = req.header('Authorization');
    //if (bearer) {
      //var token = bearer.split(' ')[1];
    var token = req.signedCookies['access_token'];
    if (token) {
      console.log('policy token: ' + token);
      TokenService.verifyToken(token, (err, decoded) => {
        if (err) {
          console.log(err);
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
        
        const expiresIn = sails.config.jwt.expiresIn * 1000;
        const expiration = new Date(Date.now() + expiresIn);
        const options = { maxAge: expiresIn, expires: expiration, overwrite: true, encode: String };
        const secureOptions = Object.assign({}, sails.config.cookies.secure, options);
        res.cookie('access_token', newToken, secureOptions);
        res.cookie('expiration', expiration.toUTCString(), options);
        
        done(false);
      });
    });
  }
};
