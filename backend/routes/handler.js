const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const Schemas = require('../models/Schemas.js');

// Model
const playerModel = mongoose.model('stats', Schemas);


router.get('/calculator', async (req, res) => {
    let data
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        if (err) throw err;
        const base = db.db("basketball-data");
        base.collection("stats").find({}).toArray(function(err, playerData) {
            if (err) throw err;
            data = playerData
            res.end(JSON.stringify(data))
            db.close()
        });
    });
});

/*
router.get('/calculator', (req, res) => {
    playerModel.find({}).exec()
      .then((data) => {
        console.log("Data found!");
        res.json(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      })
});
*/


module.exports = router;