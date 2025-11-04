const { signToken, verifyToken } = require('../utils/jwt');

describe('JWT Utilities', () => {
    beforeAll(() => {
        process.env.JWT_SECRET = 'test_secret_for_testing_only';
    });


    describe('signToken', () => {
        it('should sign a token with a payload', () => {
            const payload = { id: 'user12345', email: 'test@example.com' };
            const token = signToken(payload);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.').length).toBe(3); // JWTs have three parts
        });

        it('should throw an error if the JWT secret is not set', () => {
            const originalSecret = process.env.JWT_SECRET;
            delete process.env.JWT_SECRET;

            expect(() => signToken({ id: 'test' })).toThrow('JWT_SECRET environment variable is not set');
            process.env.JWT_SECRET = originalSecret;
        });
    });




    describe('verifyToken', () => {
        it('should verify a valid token and return the payload', () => {
            const payload = { id: 'user12345', email: 'test@example.com' };
            const token = signToken(payload);
            const decoded = verifyToken(token);
            expect(decoded).toBeDefined();
            expect(decoded.id).toBe(payload.id);
            expect(decoded.email).toBe(payload.email);
        });

        it('should throw an error for an invalid token', () => {
            expect(() => verifyToken('invalid.token.here')).toThrow();
        });

        it('should throw error for tampered token', () => {
            const payload = { id: 'user123', email: 'test@example.com' };
            const token = signToken(payload);
            const tamperedToken = token.slice(0, -5) + 'xxxxx';
            
            expect(() => verifyToken(tamperedToken)).toThrow();
            });
    });

    
});