const express = require('express');
const socketIO = require('socket.io');
const morgan = require("morgan")

const Client = require("./client");
const AppInst = require("./appinst");

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .set("view engine", "pug")     // Use .pug templates in views.
  .use(morgan("tiny"))           // Minimal logging of web requests.
  .use(express.static("dist"))   // Serve generated Javascripts.
  .get("/", (req, res) => {
    res.render("index")
  })
  .get("/inst/:appInstId", (req, res) => {
    new AppInst(req.params.appInstId).assertExists()
    res.render("index")
  })
  .get("/api/client", (req, res) => {  // Create new client token.
    res.json(Client.getOrCreate(req))
  })
  .get("/api/app/:appType/", (req, res) => { // List app instances.
    res.json(AppInst.list(req.params.appType, req.query))
  })
  .post("/api/app/:appType", (req, res) => {  // Create app instance.
    res.json(AppInst.create(req.params.appType, req.body))
  })
  .get("/api/app/inst/:instId", (req, res) => {  // Get app instance state.
    res.json(AppInst(req.params.instId).getState(req.query))
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on("connection", (socket) => {
  console.log('Client connected');
  prepareForJoin(socket)
  socket.on("disconnect", () => console.log("Client disconnected"))
})

function prepareForJoin(socket) {
  var joined = false;
  socket.on("join", (appInstId, clientId) => {
    console.log(`Join ${appInstId} ${clientId}`)
    joined = true;
    doJoin(socket, appInstId, clientId)
  });
  setTimeout(() => {
    if (!joined) {
      console.log("Client failed to join in time.")
      socket.disconnect(true)
    }
  }, 1000);
}

function doJoin(socket, appInstId, clientId) {
  socket.join(appInstId);
  io.sockets.in(appInstId).emit("stateChange", new AppInst(appInstId).getState().dots);
  socket.on("gesture", (gesture) => {
    console.log(appInstId, "gestureEcho", gesture);
    io.sockets.in(appInstId).emit("gestureEcho", Object.assign({ clientId }, gesture));
    new AppInst(appInstId).handleGesture(gesture)
  })
}

AppInst.eventEmitter.on("stateChange", (newState) => {
  console.log(newState.id, "stateChange", newState.dots);
  io.sockets.in(newState.id).emit("stateChange", newState.dots);
})
