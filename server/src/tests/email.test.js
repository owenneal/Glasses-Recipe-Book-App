const { sendRecipeEmail, isAllowedDomain } = require('../utils/email');
const { shareRecipe } = require('../controllers/recipe-controller');
const { Recipe } = require('../models/models');
const nodemailer = require('nodemailer');

// Mock nodemailer and models
jest.mock('nodemailer');
jest.mock('../models/models');

describe('Email Feature Tests', () => {
    
    describe('Utility: isAllowedDomain', () => {
        it('should return true for allowed domains', () => {
            expect(isAllowedDomain('test@gmail.com')).toBe(true);
            expect(isAllowedDomain('user@outlook.com')).toBe(true);
        });

        it('should return false for disallowed domains', () => {
            expect(isAllowedDomain('hacker@evil.com')).toBe(false);
            expect(isAllowedDomain('spammer@random.net')).toBe(false);
        });
    });

    describe('Utility: sendRecipeEmail', () => {
        beforeAll(() => {
            process.env.EMAIL_USER = 'test@ethereal.email';
            process.env.EMAIL_PASSWORD = 'password';
        });

        it('should send an email successfully', async () => {
            const mockSendMail = jest.fn().mockResolvedValue({ messageId: '123' });
            nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });

            const mockRecipe = {
                title: 'Test Cake',
                ingredients: ['Flour', 'Sugar'],
                instructions: ['Mix', 'Bake'],
                averageRating: 4.5,
                ratings: []
            };

            await sendRecipeEmail(mockRecipe, 'friend@gmail.com', 'Sender Name');

            expect(mockSendMail).toHaveBeenCalled();
            const mailOptions = mockSendMail.mock.calls[0][0];
            expect(mailOptions.to).toBe('friend@gmail.com');
            expect(mailOptions.subject).toContain('Test Cake');
        });
    });

    describe('Controller: shareRecipe', () => {
        let mockReq, mockRes;

        beforeEach(() => {
            mockReq = {
                params: { id: 'recipe123' },
                body: { recipientEmail: 'friend@gmail.com' },
                user: { id: 'user1', email: 'sender@test.com' }
            };
            mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
        });

        it('should share a public recipe successfully', async () => {
            const mockRecipe = {
                _id: 'recipe123',
                title: 'Public Pie',
                public: true,
                author: { _id: 'user2' },
                ingredients: [],
                instructions: []
            };

            Recipe.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockRecipe)
            });

            // Mock the utility function implicitly by mocking nodemailer inside it
            const mockSendMail = jest.fn().mockResolvedValue({});
            nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });

            await shareRecipe(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Recipe shared successfully!' });
        });

        it('should fail if recipient domain is invalid', async () => {
            mockReq.body.recipientEmail = 'bad@evil.com';
            
            await shareRecipe(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ 
                message: expect.stringContaining('Email domain not allowed') 
            }));
        });
    });
});