const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  var bearer = req.header('Authorization');
  if (bearer) {
    var token = bearer.split(' ')[1];

    if (TokenService.verifyToken(token)) { // TODO: add check for expired time
      next();
    }
  } else
    return res.sendStatus(401);
}
