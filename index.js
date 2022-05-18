const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jfnk8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        await client.connect();
        const todoCollection = client.db("todo-task").collection("todo");
        app.post('/todo', async(req,res)=>{
            const item = req.body;
            const result = await todoCollection.insertOne(item);
            res.send({...item,_id:result.insertedId});
        });

        app.get('/todo', async(req,res)=>{
            const query = {};
            const cursor = todoCollection.find(query);
            const todos = await cursor.toArray();
            res.send(todos);
        });

        app.delete('/delete/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todoCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running To Do App!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});