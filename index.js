const express = require('express')
const app = express()
const port = process.env.PORT|| 3000;
require('dotenv').config()
let cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors())
app.use(express.json())





  
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x4fwbpz.mongodb.net/?retryWrites=true&w=majority`;

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
    const AllCollege = client.db("Campus-Reserve").collection("AllCollege");
    const AllUser = client.db("Campus-Reserve").collection("AllUser");


    app.get('/college',async(req,res)=>{

let result = await AllCollege.find().toArray()
res.send(result)

    })
    app.get('/allcollege',async(req,res)=>{

let result = await AllCollege.find().limit(3).toArray()
res.send(result)

    })

    app.get('/college/:id',async(req,res)=>{
let Colid= req.params.id;
let query={_id: new ObjectId(Colid)}
let result = await AllCollege.find(query).toArray()
      res.send(result)
      
          })
      
          app.post('/alluser',async(req,res)=>{
            let user=req.body;
            let query={email: user.email}
            let Existsuser= await AllUser.findOne(query);
            if (Existsuser) {
              return res.send({message:'already exist'})
            }
            const result = await AllUser.insertOne(user);
            res.send(result);
            
            })   

            app.get('/alluser',async(req,res)=>{

              let result = await AllUser.find().toArray()
              res.send(result)
              
                  })


        
app.get('/alluser/:email', async(req,res)=>{
let email= req.params.email 

let result= await AllUser.find({email:email}).toArray()
res.send(result)
})
        
app.put('/Oneuser/:email', async(req, res)=>{
 let users= req.params.email

let usersInfo=req.body
let filter={
  email : users
}
let option={upsert : true}

let updateDoc={
  $set :{
  name: usersInfo.name,
  adress: usersInfo.adress,
  institute: usersInfo.institute
},
}
let result= await AllUser.updateOne(filter,updateDoc,option);
res.send(result)

})
        


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('Campus  World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})