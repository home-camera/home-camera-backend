const moment = require('moment');

module.exports = {
  create: async function(req, res) {
    if (req.query.email === null || req.query.email === '') {
      return res.sendStatus(400); // Bad Request
    }
    var user = await User.findOne({ email: req.query.email });
    if (!user) {
      return res.sendStatus(401); // Unauthorized
    }
    RandomService.generateRandom({ bytes: 64, format: 'hex' }, function(err, random) {
      if (err) {
        return res.status(500).json({ err: err });
      }
      User.update({ email: req.query.email },
        {
          resetToken: random,
          resetTokenExpireTime: moment().add(sails.config.auth.password.resetExpireTime, 'seconds').unix()
        })
        .then(function(updated) {
          const uri = sails.config.auth.resetPasswordRedirectUri;
          MailService.sendMail({
            to: user.email,
            subject: 'Reset password <home-camera>',
            text: 'Segui questo link per resettare la password: ' + uri + random,
            html: 'Segui questo link per resettare la password: </br> <b>' + uri + random + '</b>'
          }, (err) => {
            if (err) {
              return res.status(500).json({ err: err });
            } else {
              return res.sendStatus(200);
            }
          })
        })
        .catch(function(err) {
          return res.status(500).json({ err: err });;
        });
    });
  },
  update: async function(req, res) {
    if (req.body.reset_password_token === null ||
        req.body.reset_password_token === '' ||
        req.body.password === null ||
        req.body.password === '' ||
        req.body.password_confirmation === null ||
        req.body.password_confirmation === '') {
      return res.sendStatus(400); // Bad Request
    }
    // check password
    if (req.body.password !== req.body.password_confirmation) {
      return res.sendStatus(400);
    }
    var user = await User.findOne({ resetToken: req.body.reset_password_token });
    if (!user) {
      return res.status(401).json({ err: 'invalid token' }); // Unauthorized
    }
    if (!moment().isBefore(moment.unix(user.resetTokenExpireTime))) {
      return res.status(401).json({ err: 'token expired' });
    }
    User.update({ resetToken: req.body.reset_password_token },
      {
        encryptedPassword: req.body.password,
        resetTokenExpireTime: 0
      })
      .then(function(updated) {
        MailService.sendMail({
          to: user.email,
          subject: 'Reset password <home-camera>',
          text: 'La tua password è stata modificata',
          html: 'La tua password è stata modificata'
        }, (err) => {
          if (err) {
            return res.status(500).json({ err: err });
          } else {
            return res.sendStatus(200);
          }
        })
      })
      .catch(function(err) {
        console.log(err);
        return res.sendStatus(500);
      });
  }
};
