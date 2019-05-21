module.exports = {
  new: async function(req, res, next) {
    var user = await User.updateOne({ email: req.user.email })
      .set({
        confirmation_token: TokenService.createConfirmationToken()
      });
    if (!user) {
      return res.sendStatus(401);
    }
    ConfirmationService.sendConfirmationMail(user);

    //return res.sendStatus(200);
    return res.json({ "confirmation_token": user.confirmation_token });
  },
  show: async function(req, res, next) {
    var user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.sendStatus(401);
    }
    return res.json({ "confirmation_token": user.confirmation_token });
  },
  create: async function(req, res, next) {
    var user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.sendStatus(401);
    }
    var token = req.body.confirmation_token;
    if (user.confirmation_token != '' && user.confirmation_token === token) {
      return res.sendStatus(200);
    }
    else return req.sendStatus(401);
  }
};
