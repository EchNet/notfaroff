const crypto = require("crypto");

function list(appType, params) {
  return []
}

function create(appType, params) {
  const id = crypto.randomBytes(12).toString("hex");  // TODO: register app instances
  return { id }
}

function getState(instId, params) {
  return { id: instId }
}

module.exports = {
  list, create, getState
}
