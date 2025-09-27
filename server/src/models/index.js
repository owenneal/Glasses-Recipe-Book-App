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
module.exports = { User };