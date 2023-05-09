const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// SSL COMMERCE
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; //true for live, false for sandbox

// middleware configuration
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8itgidz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("unauthorized access");
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send("forbidden access");
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    const galleriesCategory = client
      .db("alumni-management-app")
      .collection("alumniGalleryCategories");

    const AllGalleryPhotos = client
      .db("alumni-management-app")
      .collection("allAlumniGalleryData");

    const AllEventsData = client

      .db("alumni-management-app")

      .collection("AllEvents");

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
    const newsComments = client.db("alumni-management-app").collection("newsComments");

    const allEventsFromData = client
      .db("alumni-management-app")
      .collection("allEventsFromData");
    const charityDonationData = client
      .db("alumni-management-app")
      .collection("charityDonationData");

    // const eventsCollection = client
    //   .db("alumni-management-app")
    //   .collection("alumniEvents");

    // charity donation start

    app.post("/charityDonation", (req, res) => {
      const charityDonationInfo = req.body;
      console.log(charityDonationInfo);
      const {
        cus_name,
        cus_country,
        cus_add1,
        cus_city,
        cus_state,
        cus_email,
        cus_postcode,
        cus_phone,
        cus_donationAmount,
        currency,
        donationId,
        donationTitle,
      } = charityDonationInfo;
      if (
        !cus_name ||
        !cus_country ||
        !cus_add1 ||
        !cus_city ||
        !cus_state ||
        !cus_email ||
        !cus_postcode ||
        !cus_phone ||
        !cus_donationAmount ||
        !currency ||
        !donationId ||
        !donationTitle
      ) {
        return res.send({ error: "Pleaase Provide All The Information" });
      }
      const transactionId = new ObjectId().toString();
      const data = {
        total_amount: charityDonationInfo?.cus_donationAmount,
        currency: charityDonationInfo?.currency,
        tran_id: transactionId, // use unique tran_id for each api call
        success_url: `https://alumni-managemnet-app-server.vercel.app/payment/success?transactionId=${transactionId}`,
        fail_url: `https://alumni-managemnet-app-server.vercel.app/payment/fail?transactionId=${transactionId}`,
        cancel_url: "https://alumni-managemnet-app-server.vercel.app/cancle",
        ipn_url: "http://localhost:3030/ipn",
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: charityDonationInfo?.cus_name,
        cus_email: charityDonationInfo?.cus_email,
        cus_add1: charityDonationInfo?.cus_add1,
        cus_add2: "Dhaka",
        cus_city: charityDonationInfo?.cus_add1,
        cus_state: charityDonationInfo?.cus_state,
        cus_postcode: charityDonationInfo?.cus_postcode,
        cus_country: charityDonationInfo?.cus_country,
        cus_phone: charityDonationInfo?.cus_phone,
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      sslcz.init(data).then((apiResponse) => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL;
        console.log(apiResponse);
        charityDonationData.insertOne({
          ...charityDonationInfo,
          transactionId,
          paid: false,
        });
        res.send({ url: GatewayPageURL });
      });
    });
    app.post("/payment/success", async (req, res) => {
      console.log("success");
      const { transactionId } = req.query;
      console.log(transactionId);
      if (!transactionId) {
        res.redirect("https://alumni-management-42856.web.app/payment/fail");
      }
      const result = await charityDonationData.updateOne(
        { transactionId },
        { $set: { paid: true, paidAt: new Date() } }
      );
      if (result.modifiedCount > 0) {
        res.redirect(
          `https://alumni-management-42856.web.app/payment/success/${transactionId}`
        );
      }
    });
    app.post("/payment/fail", async (req, res) => {
      const { transactionId } = req.query;
      if (!transactionId) {
        res.redirect("https://alumni-management-42856.web.app/payment/fail");
      }
      const result = await charityDonationData.deleteOne({ transactionId });
      if (result.deletedCount > 0) {
        res.redirect("https://alumni-management-42856.web.app/payment/fail");
      }
    });
    app.get("/payment/success/:transactionId", async (req, res) => {
      const transactionId = req.params.transactionId;
      const query = { transactionId: transactionId };
      const result = await charityDonationData.findOne(query);
      res.send(result);
    });

    app.get("/charityDonation", async (req, res) => {
      const query = {};
      const result = await charityDonationData.find(query).toArray();
      res.send(result);
    });

    app.get("/charityDonation/:cus_email", async (req, res) => {
      const cus_email = req.params.cus_email;
      const query = { cus_email: cus_email };
      const result = await charityDonationData.find(query).toArray();
      res.send(result);
    });

    app.get("/charityDonations/:donationId", async (req, res) => {
      const donationId = req.params.donationId;
      const query = { donationId: donationId };
      const result = await charityDonationData.find(query).toArray();
      res.send(result);
    });
    // charity donation end

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
    app.delete("/successFullStoryComment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await successFullStoryComments.deleteOne(query);
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

    // get charity of individual user
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
    app.get("/charity/donation/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCharityData.findOne(query);
      res.send(result);
    });
    app.put("/approveCharity/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCharity = {
        $set: {
          status: true,
        },
      };
      const result = await allCharityData.updateOne(filter, updateCharity, options);
      res.send(result);
    });
    app.put("/unApproveCharity/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCharity = {
        $set: {
          status: false,
        },
      };
      const result = await allCharityData.updateOne(filter, updateCharity, options);
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

    //approve successsFul story
    app.put("/approveSuccessStory/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCharity = {
        $set: {
          status: true,
        },
      };
      const result = await SuccessFullStory.updateOne(filter, updateCharity, options);
      res.send(result);
    });
    app.put("/unApproveSuccessStory/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCharity = {
        $set: {
          status: false,
        },
      };
      const result = await SuccessFullStory.updateOne(filter, updateCharity, options);
      res.send(result);
    });

    // successFull Story end

    // N E W S //
    // all news data
    app.get("/news", async (req, res) => {
      const query = {};
      console.log("token", req.headers.authorization);
      const newsResult = await alumniNewsCollection.find(query).toArray();
      res.send(newsResult);
    });

    app.put("/approveNews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCharity = {
        $set: {
          status: true,
        },
      };
      const result = await alumniNewsCollection.updateOne(filter, updateCharity, options);
      res.send(result);
    });

    //upApprove News
    app.put("/unApproveNews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCharity = {
        $set: {
          status: false,
        },
      };
      const result = await alumniNewsCollection.updateOne(filter, updateCharity, options);
      res.send(result);
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

    // news comments start

    app.post("/newsComments", async (req, res) => {
      const comments = req.body;
      console.log(newsComments);
      const cursor = await newsComments.insertOne(comments);
      res.send(cursor);
    });
    app.get("/newsComments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const singleNewsResult = await newsComments.findOne(query);
      res.send(singleNewsResult);
    });
    app.get("/newsComments", async (req, res) => {
      const query = {};
      const result = await newsComments.find(query).toArray();
      res.send(result);
    });
    app.get("/newsComment/:commentsId", async (req, res) => {
      const commentsId = req.params.commentsId;
      console.log(commentsId);
      const query = { commentsId: commentsId };
      const result = await newsComments.find(query).toArray();
      res.send(result);
    });
    app.delete("/newsComments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await newsComments.deleteOne(query);
      res.send(result);
    });

    // news comments end

    // news comments start

    app.post("/newsComments", async (req, res) => {
      const comments = req.body;
      console.log(newsComments);
      const cursor = await newsComments.insertOne(comments);
      res.send(cursor);
    });
    app.get("/newsComments", async (req, res) => {
      const query = {};
      const result = await newsComments.find(query).toArray();
      res.send(result);
    });
    app.get("/newsComments/:commentsId", async (req, res) => {
      const commentsId = req.params.commentsId;
      const query = { commentsId: commentsId };
      const result = await newsComments.find(query).toArray();
      res.send(result);
    });

    // news comments end

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

    // event unapprove
    app.put("/approveEvents/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCharity = {
        $set: {
          status: true,
        },
      };
      const result = await AllEventsData.updateOne(filter, updateCharity, options);
      res.send(result);
    });

    // event unapprove
    app.put("/unApproveEvents/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCharity = {
        $set: {
          status: false,
        },
      };
      const result = await alumniNewsCollection.updateOne(filter, updateCharity, options);
      res.send(result);
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

    //  A L U M N I //
    //all Alumni data
    app.get("/alumni", async (req, res) => {
      const query = {};
      const cursor = allAlumniData.find(query);
      const AllAlumni = await cursor.toArray();
      res.send(AllAlumni);
    });

    //make batch admin
    app.put("/alumni/BatchAdmin/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updatedDoc = {
        $set: {
          role: "Batch_Admin",
        },
      };
      const result = await allAlumniData.updateOne(query, updatedDoc, option);
      res.send(result);
    });

    //make super admin
    app.put("/alumni/admin/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updatedDoc = {
        $set: {
          role: "Admin",
        },
      };
      const result = await allAlumniData.updateOne(query, updatedDoc, option);
      res.send(result);
    });

    //remove admin
    app.put("/alumni/admin/remove/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updatedDoc = {
        $set: {
          role: "Admin",
        },
      };
      const result = await allAlumniData.updateOne(query, updatedDoc, option);
      res.send(result);
    });

    //year wise batch data
    app.get("/alumni/batch/:year", async (req, res) => {
      const year = req.params.year;
      const query = { graduation_year: year };
      const cursor = allAlumniData.find(query);
      const yearWiseBatchData = await cursor.toArray();
      res.send(yearWiseBatchData);
    });

    // single person data
    app.get("/alumni/:email", async (req, res) => {
      const alumniEmail = await req.params.email;
      const query = await { email: alumniEmail };
      const personData = await allAlumniData.findOne(query);
      res.send(personData);
    });

    // user created
    app.post("/alumni", async (req, res) => {
      await allAlumniData.insertOne(req.body, (err, result) => {
        if (err) {
          console.error(err);

          res.status(500).send({ message: "Error saving user data to MongoDB" });
          return;
        }
        res.send({ message: "User created successfully" });
      });
    });

    // user update
    app.put("/alumni/:email", async (req, res) => {
      const reqEmail = req.params.email;
      const filter = { email: reqEmail };

      // if not found then insert a new one
      const options = { upsert: true };
      const data = req.body;

      const updateData = {
        $set: {
          firstName: data.firstName,
          lastName: data.lastName,
          name: `${data.firstName} ${data.lastName}`,
          graduation_year: data.graduation_year,
          degree: data.degree,
          major: data.major,
          email: data.email,
          phone: data.phone,
          universityName: data.universityName,
          address: {
            street: data.address.street,
            city: data.address.city,
            state: data.address.state,
            zip: data.address.zip,
          },
          education: {
            degree: data.education.degree,
            major: data.education.major,
            institution: data.education.institution,
            graduation_year: data.education.graduation_year,
            gpa: "",
          },

          is_employed: false,

          personal_information: {
            date_of_birth: data.personal_information.date_of_birth,
            gender: data.personal_information.gender,
            blood_group: data.personal_information.blood_group,
            fathers_name: data.personal_information.fathers_name,
            mothers_name: data.personal_information.mothers_name,
            marital_status: "",
            nationality: "Bangladeshi",
            languages: ["English", "Bengali"],
            hobbies: [],
          },
        },
      };

      // console.log("----updated data -----", updatedUserData);
      const result = await allAlumniData.updateOne(filter, updateData, options);
      res.send(result);
      // console.log("---- data -----", data);
      console.log("---- updateData -----", updateData);
    });

    // delete alumni information
    app.delete("/alumni/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allAlumniData.deleteOne(query);
      res.send(result);
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

    // get all joined event with author email
    app.get("/joined-event/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await allEventsFromData.find(filter).toArray();
      res.send(result);
    });

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

    // Event post Edit and Delete section

    // get event array with author email
    app.get("/event/:email", async (req, res) => {
      email = req.params.email;
      const filter = { authorEmail: email };
      // console.log(email)
      const result = await AllEventsData.find(filter).toArray();
      res.send(result);
    });

    // update the Event info
    app.put("/event/:id", async (req, res) => {
      const id = req.params.id;
      const eventInfo = req.body;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          batch: eventInfo.batch,
          category: eventInfo.category,
          date: eventInfo.date,
          description: eventInfo.description,
          event_title: eventInfo.event_title,
          image_url: eventInfo.image_url,
          location: eventInfo.location,
        },
      };
      const result = await AllEventsData.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    // Delete The single event
    app.delete("/event/delete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await AllEventsData.deleteOne(filter);
      res.send(result);
    });

    // find the single news comments
    app.get("/single-comment", async (req, res) => {
      id = req.query.id;
      email = req.query.email;
      console.log(id, email);
      const filter = { _id: new ObjectId(id), email: email };
      const result = await newsComments.findOne(filter);
      res.send(result);
    });

    // update the previous comment of news
    app.put("/update-comment/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      // console.log(updatedData)
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          comments: updatedData.comments,
          edit: true,
          time: updatedData.time,
        },
      };
      const result = await newsComments.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    // find the single successful comments
    app.get("/single-successful-comment", async (req, res) => {
      id = req.query.id;
      email = req.query.email;
      // console.log(id, email)
      const filter = { _id: new ObjectId(id), email: email };
      const result = await successFullStoryComments.findOne(filter);
      res.send(result);
    });

    // update the previous comment of Successful story
    app.put("/update-successful-comment/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      // console.log(updatedData)
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          comments: updatedData.comments,
          edit: true,
          time: updatedData.time,
        },
      };
      const result = await successFullStoryComments.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //  JWT Authorization

    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await allAlumniData.findOne(query);

      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
        return res.send({ accessToken: token });
      }

      res.status(403).send({ accessToken: "" });
    });

    // ////////////////////////////////////////////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////////////////////////
    // const decodedEmail = req.decoded.email;

    // if (email !== decodedEmail) {
    //   return res.status(403).send({ message: "forbidden access" });
    // }

    // ////////////////////////////////////////////////////////////////////////////////////
    // //////////////////////////   D A S H B O A R D       ////////////////////////////////
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Alumni server Running!!!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
