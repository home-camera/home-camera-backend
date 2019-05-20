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
		}
	},

  customToJSON: function() {
    return _.omit(this, ['encrypted_password'])
  },
  beforeUpdate: function (values, next) {
    CipherService.hashPassword(values);
    next();
  },
  beforeCreate: function (values, next) {
    CipherService.hashPassword(values);
    next();
  }
};
