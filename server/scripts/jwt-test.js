
const { signToken, verifyToken } = require('../src/utils/jwt');
const jwt = require('jsonwebtoken');

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

(async () => {
  // ensure a secret is present for this test if not provided from env, it wont be, its only in index.js
  if (!process.env.JWT_SECRET) {
    console.log('No JWT_SECRET set; using temporary test secret (do not commit).');
    process.env.JWT_SECRET = 'test_secret_for_local_testing_only';
  }

  const payload = { id: 'user123', email: 'test@example.com' };

  // sign and verify using your helpers
  const token = signToken(payload);
  console.log('Signed token:', token);

  const decoded = verifyToken(token);
  console.log('Verified token payload:', decoded);

  // tamper token (break signature) -> should throw an error
  try {
    verifyToken(token.replace(/\./g, 'x'));
    console.error('Tampered token unexpectedly verified');
  } catch (err) {
    console.log('Tampered token failed as expected:', err.message);
  }

  // demonstrate expiry: make a 1s token and verify after 1.5s
  const short = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1s' });
  console.log('Short-lived token (1s):', short);
  await sleep(1500);
  try {
    jwt.verify(short, process.env.JWT_SECRET);
    console.error('Short token unexpectedly verified after expiry');
  } catch (err) {
    console.log('Short token expired as expected:', err.message);
  }
})();