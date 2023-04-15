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

    const AllEventsData = client.db("alumni-management-app").collection("AllEvents");
    const eventsCategory = client
      .db("alumni-management-app")
      .collection("allEventCategories");

    const AllAlumniData = client.db("alumni-management-app").collection("AllAlumniData");
    const AllUniversityName = client
      .db("alumni-management-app")
      .collection("AllUniversityName");
    const AllBatchesName = client
      .db("alumni-management-app")
      .collection("allBatchesName");

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

    // all gallery data
    app.get("/galleries", async (req, res) => {
      const query = {};
      const cursor = AllGalleryPhotos.find(query);
      const gallery = await cursor.toArray();
      res.send(gallery);
    });

    // batch wise gallery Category data
    app.get("/galleries/batch/:batchNumber", async (req, res) => {
      const batchNumber = req.params.batchNumber;
      const query = { batchNumber: batchNumber };
      const cursor = AllGalleryPhotos.find(query);
      const galleries = await cursor.toArray();
      res.send(galleries);
    });

    // gallery based on featured photos
    app.get("/galleries/featured", async (req, res) => {
      const query = { "others_info.is_fatured": true };
      const cursor = AllGalleryPhotos.find(query);
      const featuredItems = await cursor.toArray();
      res.send(featuredItems);
    });

    // gallery based on trending photos
    app.get("/galleries/trending", async (req, res) => {
      const query = { "others_info.is_trending": true };
      const cursor = AllGalleryPhotos.find(query);
      const trendingItems = await cursor.toArray();
      res.send(trendingItems);
    });

    // CategoryWise gallery data
    app.get("/galleries/:id", async (req, res) => {
      const id = req.params.id;
      const query = { gallery_category_id: id };
      const cursor = AllGalleryPhotos.find(query);
      const gallery = await cursor.toArray();
      res.send(gallery);
    });

    //  Events api

    // all events data
    app.get("/events", async (req, res) => {
      const query = {};
      const cursor = AllEventsData.find(query);
      const gallery = await cursor.toArray();
      res.send(gallery);
    });

    // all event Category data
    app.get("/eventCategories", async (req, res) => {
      const query = {};
      const cursor = eventsCategory.find(query);
      const galleries = await cursor.toArray();
      res.send(galleries);
    });

    // CategoryWise event data
    app.get("/events/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { category: id };
      const cursor = AllEventsData.find(query);
      const gallery = await cursor.toArray();
      res.send(gallery);
    });

    // single event data
    app.get("/events/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const category = await AllEventsData.findOne(query);
      res.send(category);
    });

    //  Alumni data
    // AllAlumniData
    // AllUniversityName
    // AllBatchesName

    // All University Name data
    app.get("/allUniversityName", async (req, res) => {
      const query = {};
      const cursor = AllUniversityName.find(query);
      const AllUniversityName = await cursor.toArray();
      res.send(AllUniversityName);
    });
    // All Batches Name data
    app.get("/allBatchesName", async (req, res) => {
      const query = {};
      const cursor = AllBatchesName.find(query);
      const AllBatchesName = await cursor.toArray();
      res.send(AllBatchesName);
    });

    // all Alumni data
    app.get("/alumni", async (req, res) => {
      const query = {};
      const cursor = AllAlumniData.find(query);
      const AllAlumni = await cursor.toArray();
      res.send(AllAlumni);
    });

    // year event data
    app.get("/alumni/batch/:year", async (req, res) => {
      const year = req.params.year;
      const query = { graduation_year: year };
      const cursor = AllAlumniData.find(query);
      const gallery = await cursor.toArray();
      res.send(gallery);
    });

    // single person data
    app.get("/alumni/:id", async (req, res) => {
      const id = req.params.id;
      // const query = { _id: new ObjectId(id) };
      const query = { _id: new ObjectId(id) };
      const personData = await AllEventsData.findOne(query);
      res.send(personData);
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
