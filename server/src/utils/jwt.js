// helper utility functions for signing and verifying JWT tokens

const jwt = require('jsonwebtoken');

function getSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return secret;
}

// this function signs a JWT token with a given payload and a secret key
// it is used for authentication purposes in web applications so servers can verify the identity of users
function signToken(payload) {
    const secret = getSecret();
    return jwt.sign(payload, secret, { expiresIn: '1h' });
}


function verifyToken(token) {
    const secret = getSecret();
    return jwt.verify(token, secret);
}

module.exports = { signToken, verifyToken };