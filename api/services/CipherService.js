const bcrypt = require('bcryptjs');

module.exports = {
  hashPassword: function (user, done) {
    bcrypt.hash(user.encryptedPassword, sails.config.auth.password.saltLength, (err, hash) => {
      if (err) {
        return done(err);
      }
      user.encryptedPassword = hash;
      done();
    });
  },

  comparePassword: function(password, encryptedPassword, done) {
    bcrypt.compare(password, encryptedPassword).then((res) => {
      done(res);
    });
  }
};
