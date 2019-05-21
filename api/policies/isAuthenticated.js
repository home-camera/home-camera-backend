const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  var bearer = req.header('Authorization');
  if (bearer) {
    var token = bearer.split(' ')[1];

    try {
      var decoded = TokenService.verifyToken(token);
      // TODO: add check for expired time
      req.user = decoded.user;
      next();
    } catch (err) {
      return res.sendStatus(401);
    }
  } else
    return res.sendStatus(401);
}
