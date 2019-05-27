/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    email: {
      type: 'string',
      required: true,
      isEmail: true,
      unique: true
    },
    encryptedPassword: {
      type: 'string',
      required: true,
      minLength: sails.config.auth.password.length[0],
      maxLength: sails.config.auth.password.length[1]
    },
    resetToken: {
      type: 'string',
      defaultsTo: ''
    },
    resetTokenExpireTime: {
      type: 'number',
      defaultsTo: 0
    }
  },

  customToJSON: function() {
    return _.omit(this, [ 'encryptedPassword',
                          'resetToken',
                          'resetExpireTime' ]);
  },
  beforeUpdate: function (user, next) {
    if (user.encryptedPassword) {
      CipherService.hashPassword(user, next);
    } else {
      return next();
    }
  },
  beforeCreate: function (user, next) {
    CipherService.hashPassword(user, next);
  }
};
