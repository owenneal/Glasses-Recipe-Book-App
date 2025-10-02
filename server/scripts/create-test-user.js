require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('../src/models');
const connectDB = require('../src/config/db');

// simple script to create a test user in the database


(async () => {
  await connectDB();
  const email = 'testuser@example.com';
  const password = 'testpassword';
  const name = 'Test User';

  let user = await User.findOne({ email });
  if (!user) {
    const hash = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hash });
    console.log('Created test user:', user);
  } else {
    console.log('Test user already exists:', user);
  }
  mongoose.connection.close();
})();