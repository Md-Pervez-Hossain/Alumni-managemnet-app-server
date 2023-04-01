const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

const { query } = require("express");
require("dotenv").config();

// middleware.config
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qnzupqp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const galleriesCollection = client.db("Alumni-project-data").collection("galleries");
    const galleryCollection = client.db("Alumni-project-data").collection("gallery");

    //  gallery Category data
    app.get("/galleryCategories", async (req, res) => {
      const query = {};
      const cursor = galleriesCollection.find(query);
      const galleries = await cursor.toArray();
      res.send(galleries);
    });

    // all gallery data
    app.get("/galleries", async (req, res) => {
      const query = {};
      const cursor = galleryCollection.find(query).limit(6);
      const gallery = await cursor.toArray();
      res.send(gallery);
    });

    // CategoryWise gallery data
    app.get("/galleries/:id", async (req, res) => {
      const id = req.params.id;
      const query = { gellary_id: id };
      const cursor = galleryCollection.find(query);
      const gallery = await cursor.toArray();
      res.send(gallery);
    });
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Hi From Alumni server");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
