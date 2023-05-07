// get all alumni
const getAllAlumni = async (req, res, next) => {
  const query = {};
  const cursor = allAlumniData.find(query);
  const AllAlumni = await cursor.toArray();
  res.send(AllAlumni);
};

// user created
const createAlumni = (req, res, next) => {
  allAlumniData.insertOne(req.body, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error saving user data to MongoDB" });
      return;
    }
    res.send({ message: "User created successfully" });
  });
};

module.exports = { getAllAlumni, createAlumni };
