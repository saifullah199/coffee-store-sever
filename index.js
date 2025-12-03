const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

 app.use(cors())
 app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m4mzgzp.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const coffeesCollection = client.db('coffeesDB').collection('coffees')
    const usersCollection  = client.db('coffeesDB').collection('users')

    // find all items
    app.get('/coffees', async (req, res) => {
      const result = await coffeesCollection.find().toArray()
      res.send(result)
    })

    // find a dynamic coffee
    app.get('/coffees/:id', async (req,res) => {
      const id = req.params.id   
      const query = { _id: new ObjectId(id)}
      const result = await coffeesCollection.findOne(query)
      res.send(result)
    })

    // create a item to db 
    app.post('/coffees', async (req,res) => {
      const newCoffee = req.body
      console.log(newCoffee)
      const result = await coffeesCollection.insertOne(newCoffee)
      res.send(result)
      
    })

    // update a dynamic coffee

    app.put('/coffees/:id', async (req,res) => {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedCoffee = req.body;
      const updatedDoc = {
        $set: updatedCoffee

      }
      const result = await coffeesCollection.updateOne(filter, updatedDoc,options)

      res.send(result)
    })

    // delete a dynamic coffee
    app.delete('/coffees/:id', async (req,res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await coffeesCollection.deleteOne(query)
      res.send(result)
    })

    // user related APIs
    app.get('/users', async (req,res) => {
      const result = await usersCollection.find().toArray()
      res.send(result)
      
    })
    app.post('/users', async (req,res) => {
      const userProfile = req.body
      console.log(userProfile)
      const result = await usersCollection.insertOne(userProfile)
      res.send(result)
    })

    app.delete('/users/:id', async (req,res) => {
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })


    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);


 app.get('/',(req,res) => {
    res.send('Coffee server is getting hotter')
 })

 app.listen(port, () => {
    console.log(`Coffee server is running on port ${port}`)
 })