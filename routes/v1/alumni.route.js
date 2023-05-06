const express = require("express");
const { getAllAlumni } = require("../../controller/tools.controller");
const router = express.Router();

//  A L U M N I //
//all Alumni data

router.route("/").get(getAllAlumni).post();

//year wise batch data
router.get("/batch/:year", async (req, res) => {
  const year = req.params.year;
  const query = { graduation_year: year };
  const cursor = allAlumniData.find(query);
  const yearWiseBatchData = await cursor.toArray();
  res.send(yearWiseBatchData);
});

// single person data
router.get("/:id", async (req, res) => {
  const alumniId = req.params.id;
  const query = { _id: new ObjectId(alumniId) };
  const personData = await allAlumniData.findOne(query);
  res.send(personData);
});

// user update
router.put("/:email", async (req, res) => {
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

module.exports = router;
