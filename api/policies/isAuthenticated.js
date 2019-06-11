module.exports = function(req, res, next) {
  AuthService.isAuthenticated(req, (logged) => {
    if (logged) {
      AuthService.refreshAuth(req, res, (err) => {
        if (err) {
          return res.sendStatus(401);
        } else {
          next();
        }
      });
    } else {
      return res.sendStatus(401);
    }
  });
};
