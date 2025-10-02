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
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = { User, Recipe };