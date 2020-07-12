const crypto = require("crypto");

function getOrCreate(request) {
  const token = crypto.randomBytes(12).toString("hex");  // TODO: register new tokens.
  return { id: token, token: token }
}

module.exports = {
  getOrCreate
}
