const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// fallback to a temporary secret for quick local tests (do NOT commit)
if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET not set — using temporary test secret (do NOT commit).');
    process.env.JWT_SECRET = 'test_secret_for_local_testing_only';
}
const { signToken } = require('../src/utils/jwt');
const { authenticateToken } = require('../src/middleware/auth');

function makeReq(token) {
  return { headers: { authorization: token ? `Bearer ${token}` : undefined } };
}

function makeRes() {
  return {
    statusCalled: null,
    jsonCalled: null,
    status(code) { this.statusCalled = code; return this; },
    json(obj) { this.jsonCalled = obj; return this; }
  };
}

function makeNext() {
  let called = false;
  const fn = () => { called = true; };
  fn.wasCalled = () => called;
  return fn;
}

(async () => {
  console.log('=== test: valid token ===');
  const token = signToken({ id: 'test-user', role: 'tester' });
  const req1 = makeReq(token);
  const res1 = makeRes();
  const next1 = makeNext();
  authenticateToken(req1, res1, next1);
  console.log('next called:', next1.wasCalled());
  console.log('req.user:', req1.user);

  console.log('\n=== test: missing header ===');
  const req2 = makeReq(null);
  const res2 = makeRes();
  const next2 = makeNext();
  authenticateToken(req2, res2, next2);
  console.log('next called:', next2.wasCalled());
  console.log('res status/json:', res2.statusCalled, res2.jsonCalled);

  console.log('\n=== test: invalid token ===');
  const req3 = makeReq('bad.token.value');
  const res3 = makeRes();
  const next3 = makeNext();
  authenticateToken(req3, res3, next3);
  console.log('next called:', next3.wasCalled());
  console.log('res status/json:', res3.statusCalled, res3.jsonCalled);
})();