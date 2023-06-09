const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
require("dotenv").config();
const alumniRoutes = require("./routes/v1/alumni.route");
const dbConnect = require("./utils/dbConnect");

// middleware.config
app.use(cors());
app.use(express.json());

dbConnect();

app.use("/api/v1/alumni", alumniRoutes);

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
    const allAlumniData = client.db("alumni-management-app").collection("AllAlumniData");
    const allUniversityName = client
      .db("alumni-management-app")
      .collection("AllUniversityName");
    const allDegreePrograms = client
      .db("alumni-management-app")
      .collection("allDegreePrograms");
    const allBatchesName = client
      .db("alumni-management-app")
      .collection("allBatchesName");
    const allGraduationMajor = client
      .db("alumni-management-app")
      .collection("AllGraduationMajor");
    const alumniNewsCollection = client
      .db("alumni-management-app")
      .collection("alumniNews");
    const alumniNewsCategories = client
      .db("alumni-management-app")
      .collection("alumniNewsCategories");
    const membershipForm = client
      .db("alumni-management-app")
      .collection("mebership-Form-Data");
    const SuccessFullStory = client
      .db("alumni-management-app")
      .collection("all-successFull-story-data");
    const allFundingProjects = client
      .db("alumni-management-app")
      .collection("allFundingProjects");
    const allCharityData = client
      .db("alumni-management-app")
      .collection("allCharityData");
    const successFullStoryComments = client
      .db("alumni-management-app")
      .collection("successFullStoryComments");
    const allEventsFromData = client
      .db("alumni-management-app")
      .collection("allEventsFromData");
    // const eventsCollection = client
    //   .db("alumni-management-app")
    //   .collection("alumniEvents");
    // successFullStoryComments start
    app.post("/successFullStoryComments", async (req, res) => {
      const successStoryComments = req.body;
      const cursor = await successFullStoryComments.insertOne(successStoryComments);
      res.send(cursor);
    });
    app.get("/successFullStoryComments", async (req, res) => {
      const query = {};
      const result = await successFullStoryComments.find(query).toArray();
      res.send(result);
    });
    app.get("/successFullStoryComment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await successFullStoryComments.findOne(query);
      res.send(result);
    });
    app.get("/successFullStoryComments/:commentsId", async (req, res) => {
      const commentsId = req.params.commentsId;
      const query = { commentsId: commentsId };
      const result = await successFullStoryComments.find(query).toArray();
      res.send(result);
    });
    // successFullStoryComments end
    //charity start
    app.post("/charity", async (req, res) => {
      const charityFunds = req.body;
      console.log(charityFunds);
      const cursor = await allCharityData.insertOne(charityFunds);
      res.send(cursor);
    });
    app.get("/charity", async (req, res) => {
      const query = {};
      const result = await allCharityData.find(query).toArray();
      res.send(result);
    });
    app.get("/charity/email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await allCharityData.find(query).toArray();
      res.send(result);
    });
    app.delete("/charity/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCharityData.deleteOne(query);
      res.send(result);
    });
    app.get("/charity/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCharityData.findOne(query);
      res.send(result);
    });
    app.put("/charity/:id", async (req, res) => {
      const charityInfo = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCharityInfo = {
        $set: {
          title: charityInfo?.title,
          goal_amount: charityInfo?.goal_amount,
          batchNumber: charityInfo?.batchNumber,
          deadline: charityInfo?.deadline,
          city: charityInfo?.city,
          state: charityInfo?.state,
          country: charityInfo?.country,
          details: charityInfo?.details,
          image_url: charityInfo?.image_url,
          time: charityInfo?.time,
        },
      };
      const result = await allCharityData.updateOne(filter, updatedCharityInfo, options);
      res.send(result);
    });
    //charity end
    // successFull Story start
    app.post("/successFullStory", async (req, res) => {
      const successFullStory = req.body;
      console.log(successFullStory);
      const cursor = await SuccessFullStory.insertOne(successFullStory);
      res.send(cursor);
    });
    app.get("/successFullStory", async (req, res) => {
      const query = {};
      const successStoryResult = await SuccessFullStory.find(query).toArray();
      res.send(successStoryResult);
    });
    app.get("/successFullStory/email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await SuccessFullStory.find(query).toArray();
      res.send(result);
    });
    app.get("/successFullStory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const successStoryResult = await SuccessFullStory.findOne(query);
      res.send(successStoryResult);
    });
    app.put("/successFullStory/:id", async (req, res) => {
      const story = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedStory = {
        $set: {
          title: story?.title,
          batchNumber: story?.batchNumber,
          details: story?.details,
          image_url: story?.image_url,
          time: story?.time,
        },
      };
      const result = await SuccessFullStory.updateOne(filter, updatedStory, options);
      res.send(result);
    });
    app.delete("/successFullStory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await SuccessFullStory.deleteOne(query);
      res.send(result);
    });
    app.get("/successFullStory/batch/:batchNumber", async (req, res) => {
      const batchNumber = req.params.batchNumber;
      console.log(batchNumber);
      const query = { batchNumber: batchNumber };
      console.log(query);
      const cursor = await SuccessFullStory.find(query).toArray();
      res.send(cursor);
    });
    // successFull Story end
    // N E W S //
    // all news data
    app.get("/news", async (req, res) => {
      const query = {};
      const newsResult = await alumniNewsCollection.find(query).toArray();
      res.send(newsResult);
    });
    // all news Category data
    app.get("/alumniNewsCategories", async (req, res) => {
      const query = {};
      const cursor = alumniNewsCategories.find(query);
      const galleries = await cursor.toArray();
      res.send(galleries);
    });
    //single news get
    app.get("/news/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const singleNewsResult = await alumniNewsCollection.findOne(query);
      res.send(singleNewsResult);
    });
    // create a news
    app.post("/news", async (req, res) => {
      const news = req.body;
      const cursor = await alumniNewsCollection.insertOne(news);
      res.send(cursor);
    });
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
    app.post("/gallery", async (req, res) => {
      const gallery = req.body;
      console.log(gallery);
      const cursor = await AllGalleryPhotos.insertOne(gallery);
      res.send(cursor);
    });
    app.get("/galleries/email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await AllGalleryPhotos.find(query).toArray();
      res.send(result);
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
    app.get("/gallery/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await AllGalleryPhotos.findOne(query);
      res.send(result);
    });
    app.put("/gallery/:id", async (req, res) => {
      const galleryInfo = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedGalleryInfo = {
        $set: {
          title: galleryInfo?.title,
          batchNumber: galleryInfo?.batchNumber,
          details: galleryInfo?.details,
          gallery_category: galleryInfo?.gallery_category,
          time: galleryInfo?.time,
          image_url: galleryInfo?.image_url,
        },
      };
      const result = await AllGalleryPhotos.updateOne(
        filter,
        updatedGalleryInfo,
        options
      );
      res.send(result);
    });
    app.delete("/galleries/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await AllGalleryPhotos.deleteOne(query);
      res.send(result);
    });
    // E V E N T S //
    // all events data
    app.get("/events", async (req, res) => {
      const query = {};
      const cursor = AllEventsData.find(query).sort({ date: 1 });
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
      const cursor = AllEventsData.find(query).sort({ date: 1 });
      const gallery = await cursor.toArray();
      res.send(gallery);
    });
    // batchWise event data
    app.get("/events/batch/:year", async (req, res) => {
      const year = req.params.year;
      const query = { batch: year };
      const cursor = AllEventsData.find(query).sort({ date: 1 });
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
    // create a event api // event post
    app.post("/events", async (req, res) => {
      const events = req.body;
      const cursor = await AllEventsData.insertOne(events);
      res.send(cursor);
    });
    // Alumni data
    // AllAlumniData
    // AllUniversityName
    // AllBatchesName
    // All University Name data
    app.get("/all-university-name", async (req, res) => {
      const query = {};
      const newsResult = await allUniversityName.find(query).toArray();
      res.send(newsResult);
    });
    // All Degree Programs
    app.get("/all-degree-programs", async (req, res) => {
      const query = {};
      const allDegree = await allDegreePrograms.find(query).toArray();
      res.send(allDegree);
    });
    // All Batches Name data
    app.get("/all-batches", async (req, res) => {
      const query = {};
      const options = { sort: { batchNumber: -1 } };
      const cursor = allBatchesName.find(query, options);
      const AllAlumni = await cursor.toArray();
      res.send(AllAlumni);
    });
    // All Batches Name data
    app.get("/all-graduation-major", async (req, res) => {
      const query = {};
      const options = { sort: { graduationMajor: 1 } };
      const cursor = allGraduationMajor.find(query, options);
      const AllAlumni = await cursor.toArray();
      res.send(AllAlumni);
    });
    //---- U T I L S ----//
    //   replace "%20" with "-" for blank spaces
    app.get("/api/:query", (req, res) => {
      const query = req.params.query;
      const formattedQuery = query.replace(/%20/g, "-");
      // process the formatted query
      res.send(formattedQuery);
    });
    //Membership apply form post request
    app.post("/membership", (req, res) => {
      const formData = req.body;
      console.log(formData);
      membershipForm.insertOne(formData, (err, result) => {
        if (err) throw err;
        res.status(200).send("data inserted successfully");
        client.close();
      });
    });
    // * Funding Projects * //
    // all Funding Projects data
    app.get("/funding-projects", async (req, res) => {
      const query = {};
      const FundingProjects = await allFundingProjects.find(query).toArray();
      res.send(FundingProjects);
    });
    //single Funding Projects get
    app.get("/funding-projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const singleFundingProjects = await allFundingProjects.findOne(query);
      res.send(singleFundingProjects);
    });
    // create a Funding Projects
    app.post("/funding-projects/", async (req, res) => {
      const fundingProjects = req.body;
      const cursor = await allFundingProjects.insertOne(fundingProjects);
      res.send(cursor);
    });
    // Event Joining Information
    //post all events joining members
    app.post("/join-event", async (req, res) => {
      const user = req.body;
      const cursor = await allEventsFromData.insertOne(user);
      res.send(cursor);
    });
    // find the event join info
    app.get("/join-event", async (req, res) => {
      id = req.query.id;
      email = req.query.email;
      const filter = { event_id: id, email: email };
      const result = await allEventsFromData.findOne(filter);
      res.send(result);
    });
    // update the event join info
    app.put("/join-event/:id", async (req, res) => {
      const id = req.params.id;
      const updateInfo = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          first_name: updateInfo.first_name,
          last_name: updateInfo.last_name,
          email: updateInfo.email,
          phone_number: updateInfo.phone_number,
          date: updateInfo.date,
        },
      };
      const result = await allEventsFromData.updateOne(filter, updatedDoc, options);
      res.send(result);
    });
    // Delete The event joining info
    app.delete("/join-event/delete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await allEventsFromData.deleteOne(filter);
      res.send(result);
    });
    // News CRUD system code
    // get news array with author email
    app.get("/all-news/:email", async (req, res) => {
      email = req.params.email;
      const filter = { email: email };
      const result = await alumniNewsCollection.find(filter).toArray();
      res.send(result);
    });
    // update the News info
    app.put("/news/:id", async (req, res) => {
      const id = req.params.id;
      const newsInfo = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          heading: newsInfo.heading,
          image: newsInfo.image,
          author: newsInfo.author,
          authorProfession: newsInfo.authorProfession,
          NewsCategory: newsInfo.NewsCategory,
          newsDetails: newsInfo.newsDetails,
          time: newsInfo.time,
        },
      };
      const result = await alumniNewsCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });
    // Delete The news
    app.delete("/news/delete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await alumniNewsCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Hi From Alumni server");
});

app.all("*", (req, res) => {
  res.send("No routes found");
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
