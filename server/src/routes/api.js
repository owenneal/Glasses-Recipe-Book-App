// api routing module
// defines routes for the server api
// uses controllers in controllers/index.js to handle requests
// can see they are mounted in server/src/app.js under /api



const express = require('express');
const router = express.Router();

// import  any controllers
const exampleController = require('../controllers/example-controller');
const authController = require('../controllers/auth-controller');
const recipeController = require('../controllers/recipe-controller');
const favoriteController = require('../controllers/favorite-controller');
const authenticate = require('../middleware/auth');
const { Recipe, User } = require('../models/models');



// auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// define routes that are sent from the client and handled by the controllers
router.get('/example', exampleController.getExample);
router.post('/example', exampleController.postExample);




// search/ public recipe routes
router.get('/recipes/search', recipeController.searchRecipes);
router.get('/recipes/public', recipeController.getPublicRecipes);

// recipe crud routing
router.post('/recipes', authenticate, recipeController.createRecipe);
router.get('/recipes/:id', recipeController.getRecipeById);
router.put('/recipes/:id', authenticate, recipeController.updateRecipe);
router.delete('/recipes/:id', authenticate, recipeController.deleteRecipe);
router.post('/recipes/:id/rate', authenticate, recipeController.rateRecipe);
router.post('/recipes/:id/share', authenticate, recipeController.shareRecipe);


// favorite routes
router.post('/recipes/:id/favorite', authenticate, favoriteController.toggleFavorite);
router.get('/favorites', authenticate, favoriteController.getFavoriteRecipes);
router.get('/recipes/:id/favorite-status', authenticate, favoriteController.checkFavoriteStatus);



// protected route example
router.get('/profile', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const recipes = await Recipe.find({ author: userId }).populate('author', 'name email');
        const user = await User.findById(userId).populate({
            path: 'favoriteRecipes',
            populate: { path: 'author', select: 'name email' }
        });
        res.json({ 
            user: req.user, 
            recipes,
            favorites: user.favoriteRecipes || []
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Export the router
module.exports = router;