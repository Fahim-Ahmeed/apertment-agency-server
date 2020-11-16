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


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
    const apartment = client.db(`${process.env.DB_NAME}`).collection("apartment")
  
    console.log('database connected')


    app.get('/allapartment', (req, res) => {
        apartment.find({})
          .toArray((err, documents) => {
            res.send(documents);
          })
        console.log(err)
        console.log('data loaded successfully')
      })
});

app.listen(process.env.PORT || port);