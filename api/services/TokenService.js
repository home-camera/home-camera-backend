const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');

module.exports = {
  createToken: function(user) {
    var cert_priv = fs.readFileSync(sails.config.jwt.key);
    return jwt.sign({
        user: user.toJSON()
      },
      cert_priv,
      {
        algorithm: sails.config.jwt.algorithm,
        expiresIn: sails.config.jwt.expiresIn,
        issuer: sails.config.jwt.issuer,
        audience: sails.config.jwt.audience
      }
    );
  },
  createRefreshToken: function() {
    return crypto.randomBytes(sails.config.auth.randTokenBytes).toString('hex');
  },
  verifyToken: function(token) {
    var cert_pub = fs.readFileSync(sails.config.jwt.cert);
    return jwt.verify(token, cert_pub, {
      algorithm: sails.config.jwt.algorithm,
      issuer: sails.config.jwt.issuer,
      audience: sails.config.jwt.audience
    });
  }
}
