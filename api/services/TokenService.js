const jwt = require('jsonwebtoken');
const jwtBlacklist = require('jwt-blacklist')(jwt);
const crypto = require('crypto');
const fs = require('fs');

module.exports = {
  createToken: function(payload, done) {
    fs.readFile(sails.config.jwt.key, (err, certPriv) => {
      if (err) {
        return done(err, null);
      }
      jwtBlacklist.sign(
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
    crypto.randomBytes(sails.config.auth.refreshTokenBytes, (err, token) => {
      done(err, token.toString('hex'));
    });
  },
  verifyToken: function(token, done) {
    fs.readFile(sails.config.jwt.cert, (err, certPub) => {
      if (err) {
        return done(err, null);
      }
      jwtBlacklist.verify(token,
                certPub,
                {
                  algorithm: sails.config.jwt.algorithm,
                  issuer: sails.config.jwt.issuer,
                  audience: sails.config.jwt.audience
                },
              done);
    });
  },
  blacklistToken: function(token, done) {
    jwtBlacklist.blacklist(token);
    done();
  }
};
