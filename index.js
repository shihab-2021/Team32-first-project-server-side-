const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
// const  ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z9rhw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("RoofLine");
    const users = database.collection("userCollection");
    const services = database.collection("services");
    const reviews = database.collection("reviews");
    const addOrder = database.collection("order");
    const career = database.collection("career");
    const gmail = database.collection("gmail");
    // const OurServices = database.collection('OurServices');
    // const myUserCollection = database.collection('users');

    //Post method  Method (single document)-----------API--Post
    app.post("/userCollection", async (req, res) => {
      const user = req.body;
      const result = await users.insertOne(user);
      res.json(result);
      console.log(result);
    });
    app.post("/career", async (req, res) => {
      const user = req.body;
      const result = await career.insertOne(user);
      res.json(result);
      console.log(result);
    });
    app.put("/userCollection", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await users.updateOne(filter, updateDoc, options);
      res.json(result);
      console.log(result);
    });
    //  Get Metod  get all ---------------------API--get all
    app.get("/userCollection", async (req, res) => {
      const user = users.find({});
      const result = await user.toArray();
      res.send(result);
    });
    // get services data
    app.get("/services", async (req, res) => {
      const service = services.find({});
      const result = await service.toArray();
      res.send(result);
    });
    // get single service data
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await services.findOne(query);
      res.json(service);
    });

    //Add order proces
    app.post('/order', (req, res) => {
      console.log(req.body);
      addOrder.insertOne(req.body).then((result) => {
        res.send(result);
      })
    })
    //get my orders
    app.get('/order/:email', async (req, res) => {
      const result = await order.find({ email: req.params.email }).toArray();
      res.send(result);
    })
    //
    //  //update method for make admin-----------------------admin api
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      // console.log(user)
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await users.updateOne(filter, updateDoc);
      res.json(result);
    });
    //get admin user-----------------------------------get admin user
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await users.findOne(query);
      let isAdmin = false;
      if (user?.role == "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    //Post method  review (single document)-----------API--review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviews.insertOne(review);
      res.json(result);
      console.log(result);
    });
    //get method for review
    app.get("/reviews", async (req, res) => {
      const review = reviews.find({});
      const result = await review.toArray();
      res.send(result);
    });

    // Get method for find specefic document by id---------API-- get one
    // app.get('/myDocs/:id', async(req,res)=>{
    //   const id = req.params.id;
    //   const quary = {_id:ObjectId(id)};
    //   const result = await myDocsCollection.findOne(quary);
    //   res.send(result)

    // })
    //Delete Method  delete a doc-----------------API--Delete
    // app.delete('/myDocs/:id', async(req, res)=>{
    //   const id = req.params.id;
    //   const query = {_id:ObjectId(id)};
    //   const result = await myDocsCollection.deleteOne(query);
    //   // console.log('deleted id', result);
    //   res.json(result);
    // })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.json("team32 working on......");
});

app.listen(port, () => {
  console.log("team32 listing from", port);
});
