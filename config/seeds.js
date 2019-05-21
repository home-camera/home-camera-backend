/**
 * Sails Seed Settings
 * (sails.config.seeds)
 *
 * Configuration for the data seeding in Sails.
 *
 * For more information on configuration, check out:
 * http://github.com/frostme/sails-seed
 */
module.exports.seeds = {
  user: {
    data: [
      {
        email: process.env.USER_EMAIL,
        encrypted_password:  process.env.USER_PASSWORD,
        confirmation_token: "token"
      }
    ],
    unique: ['email']
  }
}
