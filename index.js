const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const { query } = require("express");
require("dotenv").config();

// middleware.config
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8itgidz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const galleriesCategory = client
      .db("alumni-management-app")
      .collection("alumniGalleryCategories");
    const AllGalleryPhotos = client
      .db("alumni-management-app")
      .collection("allAlumniGalleryData");

    // api end points
    // all gallery Category data
    app.get("/galleryCategories", async (req, res) => {
      const query = {};
      const cursor = galleriesCategory.find(query);
      const galleries = await cursor.toArray();
      res.send(galleries);
    });
    // single gallery Category data
    app.get("/galleryCategories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const category = await galleriesCategory.findOne(query);
      res.send(category);
    });

    // batch wise gallery Category data
    app.get("/batchGallery/:batchNumber", async (req, res) => {
      const batchNumber = req.params.batchNumber;
      const query = { batchNumber: batchNumber };
      const cursor = AllGalleryPhotos.find(query);
      const galleries = await cursor.toArray();
      res.send(galleries);
    });

    // all gallery data
    app.get("/galleries", async (req, res) => {
      const query = {};
      const cursor = AllGalleryPhotos.find(query);
      const gallery = await cursor.toArray();
      res.send(gallery);
    });

    // CategoryWise gallery data
    app.get("/galleries/:id", async (req, res) => {
      const id = req.params.id;
      const query = { gallery_category_id: id };
      const cursor = AllGalleryPhotos.find(query);
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
