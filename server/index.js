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
    AppInst.validateId(req.params.appInstId)
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
    res.json(AppInst.getState(req.params.instId, req.query))
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on("connection", (socket) => {
  console.log('Client connected');
  socket.on("joinGame", (gameId) => {
    console.log(`Join game ${gameId}`)
    socket.join(gameId);
    socket.on("targetNote", (note) => {
      console.log(`Target note ${note}`)
      io.sockets.in(gameId).emit("targetNote", note);
    })
    socket.on("releaseNote", (note) => {
      console.log(`Release note ${note}`)
      io.sockets.in(gameId).emit("releaseNote", note);
    })
  });
  socket.on("disconnect", () => console.log("Client disconnected"));
});
