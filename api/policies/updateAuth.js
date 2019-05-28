module.exports = function(req, res, next) {
  if (req.me) {
    TokenService.blacklistToken(req.token);
    TokenService.createToken({ 'user': req.me }, (err, token) => {
      if (err) {
        return res.sendStatus(500);
      }
      res.set('Authorization', 'Bearer ' + token);
    });
  }
  next();
}
