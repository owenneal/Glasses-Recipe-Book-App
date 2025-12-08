const { createRecipe, getRecipeById, getPublicRecipes, rateRecipe } = require('../controllers/recipe-controller');
const { Recipe } = require('../model/models');

jest.mock('../model/models');


describe('Recipe Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: { id: 'user123' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createRecipe', () => {
    it('should create a recipe successfully', async () => {
      const recipeData = {
        title: 'Test Recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        instructions: ['step1', 'step2'],
        public: true
      };
      mockReq.body = recipeData;

      const mockRecipe = { _id: 'recipe123', ...recipeData, author: 'user123' };
      Recipe.create = jest.fn().mockResolvedValue(mockRecipe);

      await createRecipe(mockReq, mockRes);

      expect(Recipe.create).toHaveBeenCalledWith({
        ...recipeData,
        author: 'user123'
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockRecipe);
    });

    it('should return 500 on error', async () => {
      mockReq.body = { title: 'Test' };
      Recipe.create = jest.fn().mockRejectedValue(new Error('Database error'));

      await createRecipe(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error.' });
    });
  });

  describe('getRecipeById', () => {
    it('should return a recipe by id', async () => {
      const mockRecipe = {
        _id: 'recipe123',
        title: 'Test Recipe',
        author: { name: 'Test User', email: 'test@example.com' }
      };
      mockReq.params.id = 'recipe123';

      Recipe.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockRecipe)
      });

      await getRecipeById(mockReq, mockRes);

      expect(Recipe.findById).toHaveBeenCalledWith('recipe123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockRecipe);
    });

    it('should return 404 if recipe not found', async () => {
      mockReq.params.id = 'nonexistent';

      Recipe.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await getRecipeById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Recipe not found.' });
    });
  });

  describe('getPublicRecipes', () => {
    it('should return all public recipes', async () => {
      const mockRecipes = [
        { _id: '1', title: 'Recipe 1', public: true },
        { _id: '2', title: 'Recipe 2', public: true }
      ];

      Recipe.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockRecipes)
      });

      await getPublicRecipes(mockReq, mockRes);

      expect(Recipe.find).toHaveBeenCalledWith({ public: true });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockRecipes);
    });
  });

  describe('rateRecipe', () => {
    it('should prevent user from rating their own recipe', async () => {
      mockReq.params.id = 'recipe123';
      mockReq.body.rating = 5;
      mockReq.user.id = 'user123';

      const mockRecipe = {
        _id: 'recipe123',
        author: 'user123',
        ratings: []
      };

      Recipe.findById = jest.fn().mockResolvedValue(mockRecipe);

      await rateRecipe(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'You cannot rate your own recipe.' });
    });

    it('should add a new rating successfully', async () => {
      mockReq.params.id = 'recipe123';
      mockReq.body.rating = 5;
      mockReq.user.id = 'user456';

      const mockRecipe = {
        _id: 'recipe123',
        author: 'user123',
        ratings: [],
        save: jest.fn().mockResolvedValue(true)
      };

      Recipe.findById = jest.fn()
        .mockResolvedValueOnce(mockRecipe)
        .mockReturnValueOnce({
          populate: jest.fn().mockResolvedValue({
            ...mockRecipe,
            ratings: [{ user: 'user456', rating: 5 }]
          })
        });

      await rateRecipe(mockReq, mockRes);

      expect(mockRecipe.ratings).toHaveLength(1);
      expect(mockRecipe.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});