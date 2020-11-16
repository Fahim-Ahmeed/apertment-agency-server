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
  console.log('database connected')


  app.get('/allapartment', (req, res) => {
    apartment.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
    console.log(err)
    console.log('data loaded successfully')
  })
  app.post('/addapartment', (req, res) => {
    const file1 = req.files.file1;
    const file2 = req.files.file2;
    const file3 = req.files.file3;
    const file4 = req.files.file4;
    const file5 = req.files.file5;
    const title = req.body.title;
    const price = req.body.price;
    const apartmentDetails = req.body.apartmentDetails;
    const projectDetails = req.body.projectDetails;
    const location = req.body.location;
    const bathroom = req.body.bathroom;
    const bedroom = req.body.bedroom;
    const newImg1 = file1.data;
    const encImg1 = newImg1.toString('base64');
    const newImg2 = file2.data;
    const encImg2 = newImg2.toString('base64');
    const newImg3 = file3.data;
    const encImg3 = newImg3.toString('base64');
    const newImg4 = file4.data;
    const encImg4 = newImg4.toString('base64');
    const newImg5 = file5.data;
    const encImg5 = newImg5.toString('base64');

    var Primaryimage = {
      contentType: file1.mimetype,
      size: file1.size,
      img: Buffer.from(encImg1, 'base64')
    };
    var Secondimage = {
      contentType: file2.mimetype,
      size: file2.size,
      img: Buffer.from(encImg2, 'base64')
    };
    var Thirdimage = {
      contentType: file3.mimetype,
      size: file3.size,
      img: Buffer.from(encImg3, 'base64')
    };
    var Fourthimage = {
      contentType: file4.mimetype,
      size: file4.size,
      img: Buffer.from(encImg4, 'base64')
    };
    var Fifthimage = {
      contentType: file5.mimetype,
      size: file5.size,
      img: Buffer.from(encImg5, 'base64')
    };
    console.log(title, price, location, bathroom, bedroom)
    apartment.insertOne({ title, apartmentDetails, projectDetails, price, location, bathroom, bedroom, Primaryimage, Secondimage, Thirdimage, Fourthimage, Fifthimage })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })
  app.post('/makeAdmin', (req, res) => {
    admin.insertOne(req.body)
      .then(result => {
        if (result.insertedCount > 0) {
          res.send(result)
        }
        console.log('admin added successfully')
      })

  })

});

app.listen(process.env.PORT || port);