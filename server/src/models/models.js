// mongodb models
// defines the structure of documents in MongoDB collections
// so recipies, user login information, etc can be stored and retrieved



const mongoose = require('mongoose');

// defines the structure of user JSON documents in MongoDB
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    favoriteRecipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);


const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        default: [],
        required: true
    },
    instructions: {
        type: [String],
        default: [],
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: 'Uncategorized'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ratings: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            }
        }
    ],
    public: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });


// added virtual field for average rating
recipeSchema.virtual('averageRating').get(function() {
    if (this.ratings.length === 0) return 0;
    const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
    return total / this.ratings.length;
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = { User, Recipe };