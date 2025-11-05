// express app setup
// http middleware and routes are defined here
// routes are in routes/index.js


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/api');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  if (req.method !== 'GET') {
    // print small bodies only
    try { console.log('Body:', req.body); } catch (e) {}
  }
  next();
});

// middleware
//
const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
//app.options('*', cors(corsOptions)); // this line doesnt seem to work it looks like wrong syntax but it looks like it should be right




// routes for client api calls to the server in client/src/services/api.js
// these are defined in server/src/routes/index.js
app.use('/api', routes);
 
module.exports = app;