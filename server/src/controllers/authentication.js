const bcrypt = require('bcrypt');
const { User } = require('../models');
const { signToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

// POST /api/auth/register
// register a new user
async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        const alreadyExists = await User.findOne({ where: { email } });
        if (alreadyExists) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await User.create({ name, email, password: hashedPassword });
        const token = signToken({ id: newUser.id, role: newUser.role });

        return res.status(201).json({ user: { id: newUser.id, email: newUser.email }, token });

    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}


// POST /api/auth/login
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = signToken({ id: user.id, email: user.email });
        return res.status(200).json({ user: { id: user.id, email: user.email }, token });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}
