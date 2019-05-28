const moment = require('moment');

module.exports = {
  create: async function(req, res) {
    var params = req.parameters.permit('email').value();
    if (!params.hasOwnProperty('email')) {
      return res.sendStatus(400); // Bad Request
    }
    var user = await User.findOne({ email: params.email });
    if (!user) {
      return res.sendStatus(401); // Unauthorized
    }
    RandomService.generateRandom({ bytes: 64, format: 'hex' }, function(err, random) {
      if (err) {
        return res.status(500).json({ err: err });
      }
      User.update({ email: params.email },
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
    var params = req.parameters.permit('reset_password_token',
                                       'password',
                                       'password_confirmation').value();
    if (!params.hasOwnProperty('reset_password_token') ||
        !params.hasOwnProperty('password') ||
        !params.hasOwnProperty('password_confirmation')) {
      return res.sendStatus(400); // Bad Request
    }
    // check password
    if (params.password !== params.password_confirmation) {
      return res.sendStatus(400);
    }
    var user = await User.findOne({ resetToken: params.reset_password_token });
    if (!user) {
      return res.status(401).json({ err: 'invalid token' }); // Unauthorized
    }
    if (!moment().isBefore(moment.unix(user.resetTokenExpireTime))) {
      return res.status(401).json({ err: 'token expired' });
    }
    User.update({ resetToken: params.reset_password_token },
      {
        encryptedPassword: params.password,
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
        if (err.code === 'E_INVALID_VALUES_TO_SET') {
          return res.status(400).json({
            err: 'password length must be between ' + sails.config.auth.password.length[0] +
                 ' and ' + sails.config.auth.password.length[1]
            });
        }
        return res.status(500).json({ err: err });
      });
  }
};
