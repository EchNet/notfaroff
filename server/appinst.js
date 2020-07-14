const crypto = require("crypto");
const EventEmitter = require("events");

var notStorage = {
}

var eventEmitter = new EventEmitter()

class AppInst {
  constructor(id) {
    this.id = id
  }

  static list(appType, params) {
    return []
  }

  static create(appType, params) {
    const id = crypto.randomBytes(12).toString("hex");  // TODO: register app instances
    return { id }
  }

  addDot(x, y) {
    if (!notStorage[this.id]) {
      notStorage[this.id] = []
    }
    notStorage[this.id].push({ x, y })
    eventEmitter.emit("stateChange", this.getState(null))
  }

  handleGesture(gesture) {
    if (gesture.type == "click") {
      this.addDot(gesture.x, gesture.y)
    }
  }

  getState(params) {
    return { id: this.id, dots: notStorage[this.id] }
  }

  assertExists() {
  }
}

AppInst.eventEmitter = eventEmitter;

module.exports = AppInst
