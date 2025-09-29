// api routing module
// defines routes for the server api
// uses controllers in controllers/index.js to handle requests
// can see they are mounted in server/src/app.js under /api



const express = require('express');
const router = express.Router();

// import  any controllers
const exampleController = require('../controllers/index');
const authController = require('../controllers/auth-controller');
const authenticate = require('../middleware/auth');
const { Recipe } = require('../models');



// auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// define routes that are sent from the client and handled by the controllers
router.get('/example', exampleController.getExample);
router.post('/example', exampleController.postExample);


// protected route example
router.get('/profile', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const recipes = await Recipe.find({ author: { userId } }).lean();
        res.json({ user: req.user, recipes });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Export the router
module.exports = router;