const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;
const fileUpload = require('express-fileupload');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;
app.use(express.static('service'));
app.use(fileUpload());


console.log(`${process.env.DB_NAME},${process.env.DB_USER},${process.env.DB_PASS}`)
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9obvp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



app.get('/', (req, res) => {
  res.send('hlw everyone')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const apartment = client.db(`${process.env.DB_NAME}`).collection("apartment")
  const admin = client.db(`${process.env.DB_NAME}`).collection("adminPanel");
  const customer = client.db(`${process.env.DB_NAME}`).collection("customer");
  console.log('database connected')


  app.get('/allapartment', (req, res) => {
    apartment.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.post('/addapartment', (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const price = req.body.price;
    const location = req.body.location;
    const bathroom = req.body.bathroom;
    const bedroom = req.body.bedroom;
    const newImg = file.data;
    const encImg = newImg.toString('base64');
    var Primaryimage = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };
    apartment.insertOne({ title,price, location, bathroom, bedroom, Primaryimage })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/allCustomer', (req, res) => {
    customer.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  
  app.get(`/findApartment/:id`, (req, res) => {
    const viewApartent= req.params.id;
    console.log('viewApartment',viewApartent)
    apartment.find({ _id:ObjectId(viewApartent )})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.post('/addCustomer', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const number = req.body.number;
    const message= req.body.message;
    const status= req.body.status;
    const apartmentId=req.body.apartmentId;
    const title=req.body.title;
    const price=req.body.price;
   
    customer.insertOne({ name, email, number,message,status,title,price,apartmentId})
      .then(result => {
        res.send(result.insertedCount > 0);
        if(result.insertedCount > 0){
        }
        
      })
  })


  app.get('/findAdmin', (req, res) => {
    console.log(req.query.email)
    admin.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

 
 

  app.post('/makeAdmin', (req, res) => {
    admin.insertOne(req.body)
      .then(result => {
        if (result.insertedCount > 0) {
          res.send(result)
        }
      })

  })


  app.get('/findCustomer', (req, res) => {
    customer.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.patch('/updateStatus/:id', (req, res) => {
    customer.updateOne({ _id: ObjectId(req.params.id) },
      {
        $set: { status: req.body.updateStatus}
      }
    )
      .then(result =>{
        res.send(result)
       
        
      })
  })

});

app.listen(process.env.PORT || port);