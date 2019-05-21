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
      required: true
    },
    isActive: {
      type: 'boolean',
      defaultsTo: false
    },
    activatedAt: {
      type: 'number',
      defaultsTo: 0
    }
  },

  customToJSON: function() {
    return _.omit(this, [ 'encryptedPassword' ]);
  },
  beforeUpdate: function (user, next) {
    CipherService.hashPassword(user, next);
  },
  beforeCreate: function (user, next) {
    CipherService.hashPassword(user, next);
  }
};
