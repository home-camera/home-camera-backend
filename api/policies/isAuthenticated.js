module.exports = function(req, res, next) {
  var bearer = req.header('Authorization');
  if (bearer) {
    var token = bearer.split(' ')[1];
    TokenService.verifyToken(token, function(err, decoded) {
      if (err) {
        return res.sendStatus(401);
      }
      // TODO: add check for expired time
      req.user = decoded.user;
      next();
    });
  } else {
    return res.sendStatus(401);
  }
};
