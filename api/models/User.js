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
		encrypted_password: {
			type: 'string',
			required: true
		},
    confirmation_token: {
      type: 'string'
    },
    confirmed_at: {
      type: 'number',
      defaultsTo: 0
    },
    confirmation_sent_at: {
      type: 'number',
      defaultsTo: 0
    }
	},

  customToJSON: function() {
    return _.omit(this, [ 'encrypted_password',
                          'confirmation_token',
                          'confirmed_at',
                          'confirmation_sent_at' ])
  },
  beforeUpdate: function (user, next) {
    CipherService.hashPassword(user);
    next();
  },
  beforeCreate: function (user, next) {
    var confirmationToken = TokenService.createConfirmationToken();
    user.confirmation_token = confirmationToken;
    ConfirmationService.sendConfirmationMail(user);
    CipherService.hashPassword(user);
    next();
  }
};
