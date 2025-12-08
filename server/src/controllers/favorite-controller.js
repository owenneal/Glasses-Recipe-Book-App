const { User, Recipe } = require('../models/models');

async function toggleFavorite(req, res) {
    try {
        const userId = req.user.id;
        const recipeId = req.params.id;

        // Verify recipe exists
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if already favorited
        const favoriteIndex = user.favoriteRecipes.indexOf(recipeId);
        
        if (favoriteIndex > -1) {
            // Remove from favorites
            user.favoriteRecipes.splice(favoriteIndex, 1);
            await user.save();
            return res.status(200).json({ 
                message: 'Recipe removed from favorites.', 
                isFavorite: false 
            });
        } else {
            // Add to favorites
            user.favoriteRecipes.push(recipeId);
            await user.save();
            return res.status(200).json({ 
                message: 'Recipe added to favorites.', 
                isFavorite: true 
            });
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}


async function getFavoriteRecipes(req, res) {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId).populate({
            path: 'favoriteRecipes',
            populate: { path: 'author', select: 'name email' }
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user.favoriteRecipes);
    } catch (error) {
        console.error('Error fetching favorite recipes:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}


async function checkFavoriteStatus(req, res) {
    try {
        const userId = req.user.id;
        const recipeId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isFavorite = user.favoriteRecipes.includes(recipeId);
        res.status(200).json({ isFavorite });
    } catch (error) {
        console.error('Error checking favorite status:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    toggleFavorite,
    getFavoriteRecipes,
    checkFavoriteStatus
};