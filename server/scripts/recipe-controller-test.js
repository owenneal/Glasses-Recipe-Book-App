require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { createRecipe, getRecipeById, getPublicRecipes, updateRecipe, deleteRecipe, searchRecipes } = require('../src/controllers/recipe-controller');
const connectDB = require('../src/config/db');
const { User, Recipe } = require('../src/models');

// helper function to simulate Express req, res
// we just want to check status and json response as we want to see if the functions work
function makeRes() {
  return {
    statusCode: null,
    data: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.data = obj; console.log('Response:', this.statusCode, obj); return this; }
  };
}

async function testCreateRecipe(userId) {
  console.log('\n=== testCreateRecipe ===');
  await createRecipe(
    { body: { title: 'Test Pizza', ingredients: ['cheese'], instructions: ['Bake'], public: true }, user: { id: userId } },
    makeRes()
  );
}

async function testGetRecipeById(recipeId) {
  console.log('\n=== testGetRecipeById ===');
  await getRecipeById(
    { params: { id: recipeId } },
    makeRes()
  );
}

async function testGetPublicRecipes() {
  console.log('\n=== testGetPublicRecipes ===');
  await getPublicRecipes({}, makeRes());
}

async function testUpdateRecipe(recipeId) {
  console.log('\n=== testUpdateRecipe ===');
  await updateRecipe(
    { params: { id: recipeId }, body: { title: 'Updated Pizza' } },
    makeRes()
  );
}

async function testDeleteRecipe(recipeId) {
  console.log('\n=== testDeleteRecipe ===');
  await deleteRecipe(
    { params: { id: recipeId } },
    makeRes()
  );
}

async function testSearchRecipes() {
  console.log('\n=== testSearchRecipes ===');
  await searchRecipes({ query: { q: 'Pizza' } }, makeRes());
}

(async () => {
  await connectDB();

  // Find or create test user
  let user = await User.findOne({ email: 'testuser@example.com' });
  if (!user) {
    console.error('Test user not found. Run create-test-user.js first.');
    process.exit(1);
  }

  // 1. Create a recipe
  await testCreateRecipe(user._id);

  // 2. Get the created recipe's ID
  const recipe = await Recipe.findOne({ title: 'Test Pizza', author: user._id });
  if (!recipe) {
    console.error('Test recipe not found.');
    process.exit(1);
  }

  // 3. Test get by ID
  await testGetRecipeById(recipe._id);

  // 4. Test get all public recipes
  await testGetPublicRecipes();

  // 5. Test update
  await testUpdateRecipe(recipe._id);

  // 6. Test search
  await testSearchRecipes();

  // 7. Test delete
  await testDeleteRecipe(recipe._id);

  mongoose.connection.close();
})();