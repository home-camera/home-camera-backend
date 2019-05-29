module.exports = function(req, res, next) {
  var bearer = req.header('Authorization');
  if (bearer) {
    var token = bearer.split(' ')[1];
    TokenService.verifyToken(token, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: err.message });
      }
      req.me = decoded.user;
      TokenService.blacklistToken(token, () => {
        TokenService.createToken({ 'user': req.me }, (error, newToken) => {
          if (error) {
            return res.sendStatus(500);
          }
          res.set('Authorization', 'Bearer ' + newToken);
          next();
        });
      });
    });
  } else {
    return res.sendStatus(401);
  }
};
