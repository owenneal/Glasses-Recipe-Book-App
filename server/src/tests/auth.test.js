const authenticateToken = require('../middleware/auth');
const { signToken } = require('../utils/jwt');

describe('Auth Middleware Test', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret_for_testing_only';
  });

  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should call next() with valid token', () => {
    const payload = { id: 'user123', email: 'test@example.com' };
    const token = signToken(payload);
    mockReq.headers['authorization'] = `Bearer ${token}`;

    authenticateToken(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user.id).toBe(payload.id);
  });

  it('should return a 401 error if no authorization header is found', () => {
    authenticateToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'No authorization header' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header format is invalid', () => {
    mockReq.headers['authorization'] = 'InvalidFormat token';

    authenticateToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid authorization header format' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    mockReq.headers['authorization'] = 'Bearer invalid.token.here';

    authenticateToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});