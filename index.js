const express = require('express');
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

// middle wire

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    methods:["GET","POST","PUT","DELETE"],
}));




// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dam4d01.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const touristsCollection =client.db('touristsDB').collection('touristsSpot');

    app.post('/tourists',async(req,res)=>{
        // console.log(req.body)
        const result = await touristsCollection.insertOne(req.body)
        res.send(result)
    })


    app.get('/tourists',async(req,res)=>{
        const cursor = touristsCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/tourists/:id',async(req,res)=>{
        const id = req.params
        const query = { _id: new ObjectId(id)}
        const result = await touristsCollection.findOne(query)
        res.send(res)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/',(req,res)=>{
    res.send('Server is running')
})

app.listen(port,()=>{
    console.log(`Server is running port ${port}`)
})