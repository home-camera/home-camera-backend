const crypto = require('crypto');

module.exports = {
  generateRandom: function(options, done) {
    crypto.randomBytes(options.bytes, (err, random) => {
      return done(err, random.toString(options.format));
    });
  }
};
