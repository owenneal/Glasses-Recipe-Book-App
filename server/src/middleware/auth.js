// express middleware to protect routes by verifying a JWT.
// - expects "Authorization: Bearer <token>" header.
// - verifies token using ../utils/jwt.verifyToken.
// - on success attaches decoded payload to req.user and calls next().
// - on failure returns 401 with a short JSON error message.



const {verifyToken} = require('../utils/jwt');

function authenticateToken(req, res, next) {
    const auth = req.headers['authorization']; // reads the header name
    if (!auth) return res.status(401).json({error: 'No authorization header'});

    const parts = auth.split(' '); // splits into ["Bearer", "<token>"] which is the expected format
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({error: 'Invalid authorization header format'});
    }

    const token = parts[1];
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({error: 'Invalid token'});
    }
}

module.exports = {authenticateToken};