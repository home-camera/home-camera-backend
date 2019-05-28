module.exports = function(req, res, next) {
  if (req.me) {
    TokenService.createToken({ 'user': req.me }, (err, token) => {
      if (err) {
        return res.sendStatus(500);
      }
      res.set('Authorization', 'Bearer ' + token);
    });
  }
  next();
}
