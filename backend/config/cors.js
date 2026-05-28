const { CORS_ORIGIN } = require("./env");

module.exports = {
  origin: CORS_ORIGIN,
  credentials: true
};
