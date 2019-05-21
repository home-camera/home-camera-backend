const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');

module.exports = {
  createToken: function(payload, done) {
    fs.readFile(sails.config.jwt.key, function(err, certPriv) {
      if (err) {
        done(err, null);
      }
      jwt.sign(
        payload,
        certPriv,
        {
          algorithm: sails.config.jwt.algorithm,
          expiresIn: sails.config.jwt.expiresIn,
          issuer: sails.config.jwt.issuer,
          audience: sails.config.jwt.audience
        },
        done);
    });
  },
  createRefreshToken: function(done) {
    crypto.randomBytes(sails.config.auth.refreshTokenBytes, function(err, token) {
      done(err, token.toString('hex'));
    });
  },
  verifyToken: function(token, done) {
    fs.readFile(sails.config.jwt.cert, function(err, certPub) {
      if (err) {
        done(err, null);
      }
      jwt.verify(token,
                certPub,
                {
                  algorithm: sails.config.jwt.algorithm,
                  issuer: sails.config.jwt.issuer,
                  audience: sails.config.jwt.audience
                },
              done);
    });
  }
}
