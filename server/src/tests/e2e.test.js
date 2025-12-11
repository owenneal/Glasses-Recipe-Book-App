
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { User, Recipe } = require('../models/models');

describe('API End-to-End User Journey', () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        // Clean up created test data
        await User.deleteMany({ email: /@e2etest.com/ });
        await Recipe.deleteMany({ title: /E2E Test Recipe/ });
        await mongoose.connection.close();
    });

    it('should complete a full user journey: register, login, create recipes, rate, favorite, search, update, share, and delete', async () => {
        const userEmail = `e2e_user_${Date.now()}@e2etest.com`;
        const secondUserEmail = `e2e_user2_${Date.now()}@e2etest.com`;
        const password = 'password123';
        let authToken;
        let secondUserToken;
        let recipeId;
        let secondRecipeId;

        // ==================== AUTHENTICATION ====================
        
        // 1. Register first user
        console.log('\n=== Registering first user ===');
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({ name: 'E2E User', email: userEmail, password: password });
        expect(registerRes.statusCode).toBe(201);
        expect(registerRes.body).toHaveProperty('token');
        expect(registerRes.body.user).toHaveProperty('name', 'E2E User');

        // 2. Login with the first user
        console.log('=== Logging in first user ===');
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: userEmail, password: password });
        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.body).toHaveProperty('token');
        authToken = loginRes.body.token;

        // 3. Register second user (for rating/favoriting)
        console.log('=== Registering second user ===');
        const registerRes2 = await request(app)
            .post('/api/auth/register')
            .send({ name: 'E2E User 2', email: secondUserEmail, password: password });
        expect(registerRes2.statusCode).toBe(201);
        secondUserToken = registerRes2.body.token;

        // ==================== RECIPE CREATION ====================

        // 4. Create first recipe
        console.log('\n=== Creating first recipe ===');
        const createRecipeRes = await request(app)
            .post('/api/recipes')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'E2E Test Recipe - Pasta Carbonara',
                ingredients: ['Pasta', 'Eggs', 'Bacon', 'Parmesan'],
                instructions: ['Boil pasta.', 'Fry bacon.', 'Mix with eggs and cheese.'],
                public: true,
                category: 'Main Course'
            });
        expect(createRecipeRes.statusCode).toBe(201);
        expect(createRecipeRes.body).toHaveProperty('_id');
        recipeId = createRecipeRes.body._id;

        // 5. Create second recipe
        console.log('=== Creating second recipe ===');
        const createRecipeRes2 = await request(app)
            .post('/api/recipes')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'E2E Test Recipe - Chocolate Cake',
                ingredients: ['Flour', 'Sugar', 'Cocoa', 'Eggs'],
                instructions: ['Mix ingredients.', 'Bake at 350F for 30 minutes.'],
                public: true,
                category: 'Dessert'
            });
        expect(createRecipeRes2.statusCode).toBe(201);
        secondRecipeId = createRecipeRes2.body._id;

        // ==================== RECIPE RETRIEVAL ====================

        // 6. Verify first recipe can be fetched by ID
        console.log('\n=== Fetching recipe by ID ===');
        const getRecipeRes = await request(app).get(`/api/recipes/${recipeId}`);
        expect(getRecipeRes.statusCode).toBe(200);
        expect(getRecipeRes.body.title).toBe('E2E Test Recipe - Pasta Carbonara');
        expect(getRecipeRes.body.category).toBe('Main Course');

        // 7. Get all public recipes
        console.log('=== Fetching all public recipes ===');
        const publicRecipesRes = await request(app).get('/api/recipes/public');
        expect(publicRecipesRes.statusCode).toBe(200);
        expect(Array.isArray(publicRecipesRes.body)).toBe(true);
        expect(publicRecipesRes.body.length).toBeGreaterThanOrEqual(2);

        // 8. Search for recipes
        console.log('=== Searching for recipes ===');
        const searchRes = await request(app).get('/api/recipes/search?q=Pasta');
        expect(searchRes.statusCode).toBe(200);
        expect(searchRes.body.some(r => r.title.includes('Pasta'))).toBe(true);

        // ==================== RECIPE RATING ====================

        // 9. Second user rates the first recipe
        console.log('\n=== Second user rating first recipe ===');
        const rateRes = await request(app)
            .post(`/api/recipes/${recipeId}/rate`)
            .set('Authorization', `Bearer ${secondUserToken}`)
            .send({ rating: 5 });
        expect(rateRes.statusCode).toBe(200);
        expect(rateRes.body.averageRating).toBe(5);

        // 10. Verify user cannot rate their own recipe
        console.log('=== Verifying user cannot rate own recipe ===');
        const selfRateRes = await request(app)
            .post(`/api/recipes/${recipeId}/rate`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ rating: 5 });
        expect(selfRateRes.statusCode).toBe(403);

        // ==================== FAVORITES ====================

        // 11. Second user favorites the first recipe
        console.log('\n=== Second user favoriting first recipe ===');
        const favoriteRes = await request(app)
            .post(`/api/recipes/${recipeId}/favorite`)
            .set('Authorization', `Bearer ${secondUserToken}`);
        expect(favoriteRes.statusCode).toBe(200);
        expect(favoriteRes.body.isFavorite).toBe(true);

        // 12. Check favorite status
        console.log('=== Checking favorite status ===');
        const favoriteStatusRes = await request(app)
            .get(`/api/recipes/${recipeId}/favorite-status`)
            .set('Authorization', `Bearer ${secondUserToken}`);
        expect(favoriteStatusRes.statusCode).toBe(200);
        expect(favoriteStatusRes.body.isFavorite).toBe(true);

        // 13. Get user's favorite recipes
        console.log('=== Getting user favorites ===');
        const favoritesRes = await request(app)
            .get('/api/favorites')
            .set('Authorization', `Bearer ${secondUserToken}`);
        expect(favoritesRes.statusCode).toBe(200);
        expect(Array.isArray(favoritesRes.body)).toBe(true);
        expect(favoritesRes.body.some(r => r._id === recipeId)).toBe(true);

        // 14. Unfavorite the recipe
        console.log('=== Unfavoriting recipe ===');
        const unfavoriteRes = await request(app)
            .post(`/api/recipes/${recipeId}/favorite`)
            .set('Authorization', `Bearer ${secondUserToken}`);
        expect(unfavoriteRes.statusCode).toBe(200);
        expect(unfavoriteRes.body.isFavorite).toBe(false);

        // ==================== RECIPE UPDATE ====================

        // 15. Update the first recipe
        console.log('\n=== Updating recipe ===');
        const updateRes = await request(app)
            .put(`/api/recipes/${recipeId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'E2E Test Recipe - Pasta Carbonara (Updated)',
                ingredients: ['Pasta', 'Eggs', 'Bacon', 'Parmesan', 'Black Pepper'],
                instructions: ['Boil pasta.', 'Fry bacon.', 'Mix with eggs, cheese, and pepper.'],
                public: true,
                category: 'Main Course'
            });
        expect(updateRes.statusCode).toBe(200);
        expect(updateRes.body.title).toBe('E2E Test Recipe - Pasta Carbonara (Updated)');
        expect(updateRes.body.ingredients).toContain('Black Pepper');

        // 16. Verify unauthorized user cannot update
        console.log('=== Verifying unauthorized update fails ===');
        const unauthorizedUpdateRes = await request(app)
            .put(`/api/recipes/${recipeId}`)
            .set('Authorization', `Bearer ${secondUserToken}`)
            .send({ title: 'Hacked Recipe' });
        expect(unauthorizedUpdateRes.statusCode).toBe(403);



        // 18. Verify invalid email domain is rejected
        console.log('=== Verifying invalid email domain fails ===');
        const invalidShareRes = await request(app)
            .post(`/api/recipes/${recipeId}/share`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ recipientEmail: 'hacker@evil.com' });
        expect(invalidShareRes.statusCode).toBe(503);

        // ==================== USER PROFILE ====================

        // 19. Get user profile with recipes
        console.log('\n=== Getting user profile ===');
        const profileRes = await request(app)
            .get('/api/profile')
            .set('Authorization', `Bearer ${authToken}`);
        expect(profileRes.statusCode).toBe(200);
        expect(profileRes.body.recipes).toBeDefined();
        expect(profileRes.body.recipes.length).toBe(2);

        // ==================== RECIPE DELETION ====================

        // 20. Delete the second recipe
        console.log('\n=== Deleting second recipe ===');
        const deleteRes2 = await request(app)
            .delete(`/api/recipes/${secondRecipeId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(deleteRes2.statusCode).toBe(200);
        expect(deleteRes2.body.message).toBe('Recipe deleted successfully.');

        // 21. Verify deleted recipe cannot be fetched
        console.log('=== Verifying deleted recipe is gone ===');
        const getDeletedRes = await request(app).get(`/api/recipes/${secondRecipeId}`);
        expect(getDeletedRes.statusCode).toBe(404);

        // 22. Delete the first recipe
        console.log('=== Deleting first recipe ===');
        const deleteRes = await request(app)
            .delete(`/api/recipes/${recipeId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(deleteRes.statusCode).toBe(200);
        expect(deleteRes.body.message).toBe('Recipe deleted successfully.');

        // 23. Verify profile now has no recipes
        console.log('=== Verifying profile has no recipes after deletion ===');
        const finalProfileRes = await request(app)
            .get('/api/profile')
            .set('Authorization', `Bearer ${authToken}`);
        expect(finalProfileRes.statusCode).toBe(200);
        expect(finalProfileRes.body.recipes.length).toBe(0);

        console.log('\n=== E2E Test Complete ===\n');
    });
});