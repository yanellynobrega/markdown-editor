const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');

// create express app
const app = express();
app.use(cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect("mongodb://localhost:27017/markdown-editor", {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

require('./routes/file.js')(app);
// listen for requests
app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});

