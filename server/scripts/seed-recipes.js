require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User, Recipe } = require('../src/models/models');
const connectDB = require('../src/config/db');

const sampleRecipes = [
    {
        title: "Classic Margherita Pizza",
        ingredients: [
            "2 1/4 cups all-purpose flour",
            "1 tsp instant yeast",
            "1 tsp salt",
            "1 tbsp olive oil",
            "3/4 cup warm water",
            "1 cup tomato sauce",
            "2 cups mozzarella cheese",
            "Fresh basil leaves"
        ],
        instructions: [
            "Mix flour, yeast, and salt in a bowl.",
            "Add olive oil and warm water, knead for 10 minutes.",
            "Let dough rise for 1 hour.",
            "Roll out dough and spread tomato sauce.",
            "Top with mozzarella and basil.",
            "Bake at 475°F for 12-15 minutes."
        ],
        category: "Main Course",
        public: true
    },
    {
        title: "Chocolate Lava Cake",
        ingredients: [
            "4 oz dark chocolate",
            "1/2 cup butter",
            "2 eggs",
            "2 egg yolks",
            "1/4 cup sugar",
            "2 tbsp flour",
            "Vanilla ice cream for serving"
        ],
        instructions: [
            "Melt chocolate and butter together.",
            "Whisk eggs, yolks, and sugar until thick.",
            "Fold in melted chocolate and flour.",
            "Pour into greased ramekins.",
            "Bake at 425°F for 12-14 minutes.",
            "Serve immediately with ice cream."
        ],
        category: "Dessert",
        public: true
    },
    {
        title: "Caesar Salad",
        ingredients: [
            "1 large romaine lettuce head",
            "1/2 cup Caesar dressing",
            "1/2 cup parmesan cheese, grated",
            "1 cup croutons",
            "2 anchovy fillets (optional)",
            "Black pepper to taste"
        ],
        instructions: [
            "Wash and chop romaine lettuce.",
            "Toss lettuce with Caesar dressing.",
            "Add parmesan cheese and croutons.",
            "Top with anchovy fillets if desired.",
            "Grind fresh black pepper over salad.",
            "Serve immediately."
        ],
        category: "Salad",
        public: true
    },
    {
        title: "Spinach and Artichoke Dip",
        ingredients: [
            "1 cup frozen spinach, thawed",
            "1 cup artichoke hearts, chopped",
            "8 oz cream cheese",
            "1/2 cup sour cream",
            "1/2 cup mayonnaise",
            "1 cup parmesan cheese",
            "2 cloves garlic, minced",
            "Tortilla chips for serving"
        ],
        instructions: [
            "Preheat oven to 375°F.",
            "Mix all ingredients except chips in a bowl.",
            "Transfer to baking dish.",
            "Bake for 25-30 minutes until bubbly.",
            "Let cool for 5 minutes.",
            "Serve with tortilla chips."
        ],
        category: "Appetizer",
        public: true
    },
    {
        title: "Creamy Tomato Soup",
        ingredients: [
            "2 lbs fresh tomatoes",
            "1 onion, chopped",
            "3 cloves garlic, minced",
            "2 cups vegetable broth",
            "1/2 cup heavy cream",
            "2 tbsp olive oil",
            "Fresh basil",
            "Salt and pepper to taste"
        ],
        instructions: [
            "Roast tomatoes at 400°F for 30 minutes.",
            "Sauté onion and garlic in olive oil.",
            "Add roasted tomatoes and broth.",
            "Simmer for 20 minutes.",
            "Blend until smooth.",
            "Stir in cream and season.",
            "Garnish with fresh basil."
        ],
        category: "Soup",
        public: true
    },
    {
        title: "Blueberry Pancakes",
        ingredients: [
            "2 cups all-purpose flour",
            "2 tbsp sugar",
            "2 tsp baking powder",
            "1/2 tsp salt",
            "2 eggs",
            "1 3/4 cups milk",
            "1/4 cup melted butter",
            "1 cup fresh blueberries",
            "Maple syrup for serving"
        ],
        instructions: [
            "Mix dry ingredients in a large bowl.",
            "Whisk eggs, milk, and melted butter.",
            "Combine wet and dry ingredients.",
            "Gently fold in blueberries.",
            "Pour 1/4 cup batter onto hot griddle.",
            "Flip when bubbles form.",
            "Serve with maple syrup."
        ],
        category: "Breakfast",
        public: true
    },
    {
        title: "Grilled Chicken Teriyaki",
        ingredients: [
            "4 chicken breasts",
            "1/2 cup soy sauce",
            "1/4 cup honey",
            "2 tbsp rice vinegar",
            "2 cloves garlic, minced",
            "1 tsp ginger, grated",
            "2 tbsp cornstarch",
            "Sesame seeds for garnish",
            "Green onions for garnish"
        ],
        instructions: [
            "Mix soy sauce, honey, vinegar, garlic, and ginger.",
            "Marinate chicken for 30 minutes.",
            "Grill chicken for 6-7 minutes per side.",
            "Simmer remaining marinade with cornstarch.",
            "Brush sauce on cooked chicken.",
            "Garnish with sesame seeds and green onions."
        ],
        category: "Main Course",
        public: true
    },
    {
        title: "Classic Tiramisu",
        ingredients: [
            "6 egg yolks",
            "3/4 cup sugar",
            "1 1/3 cups mascarpone cheese",
            "2 cups heavy cream",
            "2 cups strong espresso, cooled",
            "3 tbsp coffee liqueur",
            "24 ladyfinger cookies",
            "Cocoa powder for dusting"
        ],
        instructions: [
            "Whisk egg yolks and sugar until thick.",
            "Fold in mascarpone cheese.",
            "Whip cream and fold into mixture.",
            "Mix espresso and liqueur.",
            "Dip ladyfingers briefly in coffee.",
            "Layer cookies and cream mixture.",
            "Refrigerate 4 hours.",
            "Dust with cocoa before serving."
        ],
        category: "Dessert",
        public: true
    },
    {
        title: "Greek Salad",
        ingredients: [
            "3 tomatoes, cut into wedges",
            "1 cucumber, sliced",
            "1 red onion, thinly sliced",
            "1 green bell pepper, chopped",
            "1 cup Kalamata olives",
            "1 cup feta cheese, cubed",
            "1/4 cup olive oil",
            "2 tbsp red wine vinegar",
            "1 tsp dried oregano",
            "Salt and pepper"
        ],
        instructions: [
            "Combine tomatoes, cucumber, onion, and pepper in bowl.",
            "Add olives and feta cheese.",
            "Whisk together olive oil, vinegar, and oregano.",
            "Pour dressing over salad.",
            "Season with salt and pepper.",
            "Toss gently and serve."
        ],
        category: "Salad",
        public: true
    },
    {
        title: "Buffalo Chicken Wings",
        ingredients: [
            "2 lbs chicken wings",
            "1/2 cup hot sauce",
            "1/4 cup butter, melted",
            "1 tbsp white vinegar",
            "1/4 tsp cayenne pepper",
            "1/4 tsp garlic powder",
            "Ranch or blue cheese dressing",
            "Celery sticks"
        ],
        instructions: [
            "Preheat oven to 400°F.",
            "Pat chicken wings dry.",
            "Bake wings for 45 minutes, flipping halfway.",
            "Mix hot sauce, butter, vinegar, and spices.",
            "Toss wings in buffalo sauce.",
            "Serve with ranch and celery."
        ],
        category: "Appetizer",
        public: true
    }
];

async function seedRecipes() {
    try {
        await connectDB();
        console.log('Connected to database');

        // Find or create a demo user
        let demoUser = await User.findOne({ email: 'demo@recipeapp.com' });
        
        if (!demoUser) {
            console.log('Creating demo user...');
            const hashedPassword = await bcrypt.hash('demo123', 10);
            demoUser = await User.create({
                name: 'Demo Chef',
                email: 'demo@recipeapp.com',
                password: hashedPassword
            });
            console.log('Demo user created!');
        } else {
            console.log('Demo user already exists');
        }

        // Clear existing recipes from demo user
        await Recipe.deleteMany({ author: demoUser._id });
        console.log('Cleared existing demo recipes');

        // Add recipes
        console.log('\nAdding recipes...\n');
        for (const recipeData of sampleRecipes) {
            const recipe = await Recipe.create({
                ...recipeData,
                author: demoUser._id
            });
            console.log(`✓ Added: ${recipe.title} (${recipe.category})`);
        }

        console.log('\n✅ Successfully seeded 10 recipes!');
        console.log('\nDemo User Credentials:');
        console.log('Email: demo@recipeapp.com');
        console.log('Password: demo123');
        console.log('\nYou can log in with these credentials to see all recipes.');

    } catch (error) {
        console.error('Error seeding recipes:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
}

seedRecipes();