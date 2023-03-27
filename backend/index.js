const express = require('express');
const bodyParser = require('body-parser');
const routesHandler = require('./routes/handler.js');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use('/', routesHandler);

const PORT = process.env.PORT || 4000; // backend routing port

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology:true})
.then( () => {
    console.log('MongoDB Connected!');
})
.catch( (err) => {
    console.log(err);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

