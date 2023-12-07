const express = require("express");
const mongodb = require("mongodb");
var cors = require("cors");
require("dotenv").config();
const mongoClient = mongodb.MongoClient;
const app = express();
const port = process.env.PORT || '8000';
const MONGO_URL = process.env.MONGO || "mongodb://127.0.0.1:27017";
//const port = process.env.port;
//const dbURL = process.env.DB_URL;
app.use(express.json());
app.use(cors());

//Home--------------------------------------------------

app.get("/", function (req, res) {
  res.send("🙋‍♂️, 🌏 🎊✨🤩");
});

//create a mentor

app.post("/create-mentor", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbURL);
    let db = client.db("Mentor");
    let result = await db.collection("mentors").insertMany(req.body);
    res.status(200).json({ message: "mentor created" });
  } catch (error) {
    res.sendStatus(500);
  }
});

//-----------------------------------------------------------------------------------------//

// create a student
app.post("/create-student", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbURL);
    let db = client.db("Mentor");
    let result = await db.collection("students").insertMany(req.body);
    res.status(200).json({ message: "students created" });
  } catch (error) {
    res.sendStatus(500);
  }
});

//-----------------------------------------------------------------------------------------//

// assign a mentor->Select One Student and Assign one Mentor

app.put("/assignMentor", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbURL);

    let db = client.db("Mentor");
    await db
      .collection("mentors")
      .updateOne(
        { std_Id: req.body.student_Id },
        { $set: { mentor_Id: req.body.mentor_Id } }
      );
    let result = await db.collection("students").find({}).toArray();
    res.status(200).json({ message: "mentor assigned", result });
  } catch (error) {
    res.sendStatus(500);
  }
});

//-----------------------------------------------------------------------------------------//

//Select one mentor and Add multiple Student
//A student who has a mentor should not be shown in List->easy we can filter in frontEnd

app.patch("/assignStudent", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbURL);
    let db = client.db("Mentor");
    await db
      .collection("mentors")
      .updateOne(
        { mentor_name: req.body.mentor_name },
        { $push: { students: { $each: req.body.studentNames } } }
      );

    res.status(200).json({ message: "Students successfully added to mentor" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add students to mentor", error: err });
  }
});

//-----------------------------------------------------------------------------------------//

// read students list

app.get("/students-list", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbURL);
    let db = client.db("Mentor");
    let result = await db.collection("students").find({}).toArray();
    res.status(200).json({ message: " student list", result });
  } catch (error) {
    res.sendStatus(500);
  }
});

//-----------------------------------------------------------------------------------------//

// read mentors list

app.get("/mentors-list", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbURL);
    let db = client.db("Mentor");
    let result = await db.collection("mentors").find({}).toArray();
    res.status(200).json({ message: " mentors list", result });
  } catch (error) {
    res.sendStatus(500);
  }
});

//-----------------------------------------------------------------------------------------//

// students without mentor
app.get("/idle-students", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbURL);
    let db = client.db("Mentor");
    let result = await db
      .collection("students")
      .find({ mentor_Id: null })
      .toArray();
    res.status(200).json({
      message: "list of students without a mentor",
      result,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

//-----------------------------------------------------------------------------------------//

// students under mentor
app.get("/students-under-mentor/:mentor_name", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbURL);
    let db = client.db("Mentor");

    let result = await db
      .collection("students")
      .find({ mentor_Id: req.params })
      .toArray();
    res.status(200).json({
      message: `students under mentor_Id: `,
      result,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log("server started at " + port);
});
