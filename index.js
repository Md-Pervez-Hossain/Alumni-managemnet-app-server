const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
require("dotenv").config();

// SSL COMMERCE
// const store_id = env.process.STORE_ID;
// const store_passwd = env.process.STORE_PASSWORD;
// const is_live = false; //true for live, false for sandbox

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

    // const eventsCollection = client
    //   .db("alumni-management-app")
    //   .collection("alumniEvents");

    // successFullStoryComments start

    app.post("/successFullStoryComments", async (req, res) => {
      const successStoryComments = req.body;
      console.log(successStoryComments);
      const cursor = await successFullStoryComments.insertOne(successStoryComments);
      res.send(cursor);
    });

    app.get("/successFullStoryComments", async (req, res) => {
      const query = {};
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

    app.get("/charity/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCharityData.findOne(query);
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
    app.get("/successFullStory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const successStoryResult = await SuccessFullStory.findOne(query);
      res.send(successStoryResult);
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

    //  A L U M N I //
    //all Alumni data
    app.get("/alumni", async (req, res) => {
      const query = {};
      const cursor = allAlumniData.find(query);
      const AllAlumni = await cursor.toArray();
      res.send(AllAlumni);
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
    app.get("/alumni/:id", async (req, res) => {
      const alumniId = req.params.id;
      const query = { _id: new ObjectId(alumniId) };
      const personData = await allAlumniData.findOne(query);
      res.send(personData);
    });

    // user created
    app.post("/alumni", (req, res) => {
      allAlumniData.insertOne(req.body, (err, result) => {
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
      const updatedUserData = {
        $set: {
          firstName: data.firstName,
          lastName: data.lastName,
          name: `${data.firstName} ${data.lastName}`,
          profile_picture: data.display_url,
          graduation_year: data.graduation_year,
          degree: data.degree,
          major: data.major,
          email: data.email,
          phone: data.phone,
          universityName: data.universityName,
          phone_2: data.phone_2,
          address: {
            street: data.streetAddress,
            city: data.city,
            state: data.stateName,
            zip: data.zipCode,
          },
          education: [
            {
              degree: data.degree,
              major: data.major,
              institution: data.universityName,
              graduation_year: data.graduation_year,
              gpa: "",
            },
          ],
          is_employed: false,
          careers: [
            {
              company: "",
              position: "",
              start_date: "",
              end_date: "",
              responsibilities: "",
            },
          ],
          personal_information: {
            date_of_birth: data.dateOfBirth,
            gender: data.gender,
            blood_group: data.bloodGroup,
            fathers_name: data.fatherName,
            mothers_name: data.motherName,
            marital_status: "",
            nationality: "Bangladeshi",
            languages: ["English", "Bengali"],
            hobbies: [],
          },
        },
      };
      const result = await allAlumniData.updateOne(filter, updatedUserData, options);
      res.send(result);
      console.log("---- data -----", data);
      console.log("----updated data -----", updatedUserData);
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
