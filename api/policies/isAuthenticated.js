module.exports = function(req, res, next) {
  var bearer = req.header('Authorization');
  if (bearer) {
    var token = bearer.split(' ')[1];
    TokenService.verifyToken(token, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: err.message });
      }
      req.user = decoded.user;
      req.token = token;
      next();
    });
  } else {
    return res.sendStatus(401);
  }
};
