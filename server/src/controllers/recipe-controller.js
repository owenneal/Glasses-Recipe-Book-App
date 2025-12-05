const { Recipe } = require('../models/models');
const { sendRecipeEmail } = require('../utils/email');

// creating a recipe in the database
// needs: title, ingredients, instructions, public
async function createRecipe(req, res) {
    try {
        const { title, ingredients, instructions, public } = req.body;
        const author = req.user ? req.user.id : null;
        const recipe = await Recipe.create({ title, ingredients, instructions, public, author });
        res.status(201).json(recipe);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

// will be used to get the specifics of a recipe after a client clicks on it (the id will be stored in the url in like a menu or something)
async function getRecipeById(req, res) {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('author', 'name email');
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}


// will be used to get all public recipes for the homepage (so like an ALL recipes page)
async function getPublicRecipes(req, res) {
    try {
        const recipes = await Recipe.find({ public: true }).populate('author', 'name email');
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error fetching public recipes:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}


// wil be used to update a recipe
async function updateRecipe(req, res) {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }


        if (recipe.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this recipe.' });
        }

        Object.assign(recipe, req.body);
        await recipe.save();
        res.status(200).json(recipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

// will be used to delete a recipe
async function deleteRecipe(req, res) {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }
        res.status(200).json({ message: 'Recipe deleted successfully.' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}


// function to search for recipes by a title, also just including public recipes in case of empty search
async function searchRecipes(req, res) {
    try {
        const query = req.query.q || '';
        const recipes = await Recipe.find({
            public: true,
            title : { $regex: query, $options: 'i' }
        });
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error searching recipes:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

// new function to rate a recipe or update rating if user already rated
async function rateRecipe(req, res) {
    try {
        const { rating } = req.body;
        const userId = req.user.id;
        const recipeId = req.params.id;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        if (recipe.author.toString() === userId) {
            return res.status(403).json({ message: "You cannot rate your own recipe." });
        }


        // checks if a user already rated the recipe
        const existingRatingIndex = recipe.ratings.findIndex(r => r.user.toString() === userId);
        if (existingRatingIndex > -1) {
            recipe.ratings[existingRatingIndex].rating = rating;
        } else {
            recipe.ratings.push({ user: userId, rating });
        }

        await recipe.save();
        const updatedRecipe = await Recipe.findById(recipeId).populate('author', 'name email');

        res.status(200).json(updatedRecipe);
    } catch (error) {
        console.error('Error rating recipe:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}


async function shareRecipe(req, res) {
    try {
        const { recipientEmail } = req.body;
        const recipeId = req.params.id;
        const senderName = req.user?.email || 'A user';

        if (!recipientEmail) {
            return res.status(400).json({ message: 'Recipient email is required.' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recipientEmail)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        const recipe = await Recipe.findById(recipeId).populate('author', 'name email');
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        // Only allow sharing public recipes or user's own recipes
        if (!recipe.public && recipe.author._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You can only share public recipes or your own recipes.' });
        }

        await sendRecipeEmail(recipe, recipientEmail, senderName);

        res.status(200).json({ message: 'Recipe shared successfully!' });
    } catch (error) {
        console.error('Error sharing recipe:', error);
        if (error.message.includes('Email domain not allowed')) {
            return res.status(400).json({ message: error.message });
        }
        if (error.message.includes('Email service not configured')) {
            return res.status(503).json({ message: 'Email service is not configured. Please contact the administrator.' });
        }
        res.status(500).json({ message: 'Failed to share recipe. Please try again.' });
    }
}



module.exports = {
    createRecipe,
    getRecipeById,
    getPublicRecipes,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    rateRecipe,
    shareRecipe
};