const express = require('express');
const bodyParser = require('body-parser');
const routesHandler = require('./routes/handler.js');
const mongoose = require('mongoose');
require('dotenv/config')

const app = express();
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use('/', routesHandler);

const PORT = process.env.PORT || 4000; // backend routing port

/*const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology:true}, function(err, db) {
            if (err) throw err;
                const base = db.db("basketball-data");
        })
        .then( () => {
            console.log('MongoDB Connected!');
        })
        .catch( (err) => {
            console.log(err);
        });
    } catch(error) {
        console.log(error)
        process.exit()
    }
} 

module.exports = connectToMongo;
*/

const dbOptions = {useNewUrlParser: true, useUnifiedTopology:true}
mongoose.connect(process.env.MONGODB_URI, dbOptions)
.then(() => console.log("Database Connected!"))
.catch(err => console.log(err))

/*
MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
    if (err) throw err;
    const base = db.db("basketball-data");
    base.collection("stats").find({}).toArray(function(err, result) {
        if (err) throw err;
        //console.log(base);
        //console.log(result);
        db.close()
    });
}); 
*/

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

