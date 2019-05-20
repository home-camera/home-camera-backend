module.exports.jwt = {
  expiresIn: process.env.JWT_EXPIRES,
  algorithm: process.env.JWT_ALGORITHM || "HS256",
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
  cert: '.jwt/' + process.env.JWT_CERT,
  key: '.jwt/' + process.env.JWT_PRIVATE
}
