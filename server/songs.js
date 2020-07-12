
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

