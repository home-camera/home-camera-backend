module.exports.jwt = {
  expiresIn: process.env.JWT_EXPIRES,
  algorithm: process.env.JWT_ALGORITHM || 'HS256',
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
  cert: process.env.JWT_CERTS_DIR + '/' + process.env.JWT_CERT,
  key: process.env.JWT_CERTS_DIR + '/' + process.env.JWT_PRIVATE
};
