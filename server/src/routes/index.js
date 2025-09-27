// api routing module
// defines routes for the server api
// uses controllers in controllers/index.js to handle requests
// can see they are mounted in server/src/app.js under /api



const express = require('express');
const router = express.Router();

// import  any controllers
const exampleController = require('../controllers/index');

// define routes that are sent from the client and handled by the controllers
router.get('/example', exampleController.getExample);
router.post('/example', exampleController.postExample);

// Export the router
module.exports = router;