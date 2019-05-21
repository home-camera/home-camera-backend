const bcrypt = require('bcryptjs');

module.exports = {
  hashPassword: function (user, done) {
    if (user.encrypted_password) {
      bcrypt.hash(user.encrypted_password, sails.config.auth.saltLength, function(err, hash) {
        user.encrypted_password = hash;
        done();
      });
    }
  },

  comparePassword: function(password, encrypted_password) {
    /*
    bcrypt.compare(password, user.encrypted_password).then((res) => {
      next(res);
    }); */
    return bcrypt.compareSync(password, encrypted_password);
  }
};
