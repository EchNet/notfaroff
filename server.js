const express = require('express');
const socketIO = require('socket.io');
const {MongoClient} = require("mongodb");

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/notion"
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
  .get("/song", (req, res) => {
    get_random_song_title(res)
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


const get_random_song_title = (res) => {
  MongoClient.connect(MONGODB_URI, {useUnifiedTopology: true}, (err, db) => {
    if (err) {
      res.status(500).send("connect:" + err.toString())
    }
    else {
      db.db("notion").collection("songs").estimatedDocumentCount((err, count) => {
        if (err) {
          res.status(500).send("document count:" + err.toString())
          db.close();
        }
        else {
          const ix = Math.floor(Math.random() * count);
          db.db("notion").collection("songs").find({}).toArray((err, result) => {
            if (err) {
              res.status(500).send("find: " + err.toString())
            }
            else {
              res.send(result[ix].title);
            }
            db.close();
          })
        }
      })
    }
  })
}
