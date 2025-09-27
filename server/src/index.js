// entry point for the server part of the app
// loads env variablers and connects to the database then starts the server
// this is mainly start up logic




require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });