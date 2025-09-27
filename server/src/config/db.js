// database connection setup
// uses mongoose to connect to MongoDB



const mongoose = require('mongoose');

const connectDB = async () => {
    try {

        const mongoUri = process.env.MONGO_URI || process.env.DATABASE_URL;
        if (!mongoUri) {
            throw new Error('MONGO_URI or DATABASE_URL environment variable is not set');
        }

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;