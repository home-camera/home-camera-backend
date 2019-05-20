const bcrypt = require('bcryptjs');

module.exports = {
  hashPassword: function (user) {
    /*
    if (user.encrypted_password) {
      bcrypt.hash(user.encrypted_password, sails.config.auth.saltLength, function(err, hash) {
        user.encrypted_password = hash;
      });
    }
    */
    var salt = bcrypt.genSaltSync(sails.config.auth.saltLength);
    var hash = bcrypt.hashSync(user.encrypted_password, salt);
    user.encrypted_password = hash;
  },

  comparePassword: function(password, encrypted_password) {
    /*
    bcrypt.compare(password, user.encrypted_password).then((res) => {
      next(res);
    }); */
    return bcrypt.compareSync(password, encrypted_password);
  }
};
