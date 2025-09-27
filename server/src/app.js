// express app setup
// http middleware and routes are defined here
// routes are in routes/index.js


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// middleware
//
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes for client api calls to the server in client/src/services/api.js
// these are defined in server/src/routes/index.js
app.use('/api', routes);

module.exports = app;