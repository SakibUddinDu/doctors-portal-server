

const express = require("express");
const app = express();
// const bodyParser = require('body-parser');
const cors = require("cors");
const fileUpload = require('express-fileupload')
require("dotenv").config();
// const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// appointments
app.use(express.json()); //instead of bodyparser
// app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('doctors'))
app.use(fileUpload())

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.abcuj.mongodb.net//${process.env.DB_NAME}?retryWrites=true&w=majority`;
//  console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log(err);
  const appointmentCollection = client
    .db("doctorsPortal")
    .collection("appointments");

  app.post("/addAppointment", (req, res) => {
    const appointment = req.body;
    console.log("adding new Product : ", appointment);
    appointmentCollection.insertOne(appointment).then((result) => {
      console.log("inserted Count", result);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/appointments", (req, res) => {
    appointmentCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/appointmentsByDate", (req, res) => {
    const date = req.body;
    console.log(date.date);
    appointmentCollection
      .find({ date: date.date })
      .toArray((err, documents) => {
        res.send(documents);
      });

    // .then((result) => {
    //   console.log("inserted Count", result);
    //   res.send(result.insertedCount > 0);
    // });
  });

  app.post('/addADoctor', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;

 console.log(file, name, email)

 file.mv(`${__dirname}/doctors/${file.name}`, err =>{
   if (err){
     console.log(err);
     return res.status(500).send({msg: 'Failed to Upload Image'})
   }
   return res.send({name:file.name, path: `/${file.name}`})
   
 })
})


//55.5-2 upload img to the server
//   app.post('/addADoctor', (req, res) => {
//     const file = req.files.file;
//     const name = req.body.name;
//     const email = req.body.email;

//  console.log(file, name, email)

//  file.mv(`${__dirname}/doctors/${file.name}`, err =>{
//    if (err){
//      console.log(err);
//      return res.status(500).send({msg: 'Failed to Upload Image'})
//    }
//    return res.send({name:file.name, path: `/${file.name}`})
   
//  })
// })

});
// new Date().toLocaleString("en-US", {timeZone: "Asia/Dhaka"})
// console.log(new Date().getTimezoneOffset())
app.listen(process.env.PORT || port);
