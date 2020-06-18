const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .set("view engine", "pug")
  .use(express.static("dist"))
  .get("/", (req, res) => {
    res.render("index")
  })
  .get("/start", (req, res) => {
    gameId = createNewGame()
    res.redirect(`/app/${gameId}`)
  })
  .get("/app/:gameId", (req, res) => {
    res.render("app", { gameId: req.params.gameId })
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

const crypto = require("crypto");
const createNewGame = () => crypto.randomBytes(12).toString("hex");
