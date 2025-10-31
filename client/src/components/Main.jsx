import { useEffect, useState, useMemo } from "react";
import "../styles.css";
import RecipeInput from "./Input";
import api, { rateRecipe } from "../services/api";
import RecipeCard from "./RecipeCard";

export default function Main({ user, onLogout, onNavigate }) {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  // Load from backend instead of mockdata.js
  useEffect(() => {
    api.get('/recipes/public')
      .then((res) => {
        setRecipes(res.data || []);
      })
      .catch((err) => console.error("Failed to load recipes", err));
  }, []);

  // Add new recipe to state
  const addRecipe = (newRecipe) => {
    setRecipes((prev) => [...prev, newRecipe]);
  };


  const handleRateRecipe = async (recipeId, rating) => {
    try {
      const updatedRecipe = await rateRecipe(recipeId, rating);
      setRecipes(prevRecipes => 
        prevRecipes.map(r => (r._id === recipeId ? updatedRecipe : r))
      );
    } catch (error) {
      console.error("Failed to rate recipe:", error);
      alert(error.response?.data?.message || "You must be logged in to rate a recipe.");
    }
  };

  // Filtering logic
  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchLower) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(searchLower)
          ) ||
          recipe.instructions.some((instruction) =>
            instruction.toLowerCase().includes(searchLower)
          )
      );
    }

    if (selectedFilter !== "all") {
      filtered = filtered.filter((recipe) => {
        const title = recipe.title.toLowerCase();
        switch (selectedFilter) {
          case "dessert":
            return (
              title.includes("cookie") ||
              title.includes("cake") ||
              title.includes("chocolate")
            );
          case "main":
            return (
              title.includes("risotto") ||
              title.includes("pasta") ||
              title.includes("chicken")
            );
          case "salad":
            return title.includes("salad") || title.includes("quinoa");
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [recipes, searchTerm, selectedFilter]);

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedFilter("all");
  };

  const filterOptions = [
    { value: "all", label: "All Recipes", count: recipes.length },
    {
      value: "dessert",
      label: "Desserts",
      count: recipes.filter(
        (r) =>
          r.title.toLowerCase().includes("cookie") ||
          r.title.toLowerCase().includes("chocolate")
      ).length,
    },
    {
      value: "main",
      label: "Main Dishes",
      count: recipes.filter((r) =>
        r.title.toLowerCase().includes("risotto")
      ).length,
    },
    {
      value: "salad",
      label: "Salads",
      count: recipes.filter((r) =>
        r.title.toLowerCase().includes("salad")
      ).length,
    },
  ];

  return (
    <div className="app-container">
      {/* Search and Filter Header */}
      <div className="search-header">
        {/* Welcome Bar with User Info */}
        <div className="welcome-bar">
          <div className="user-greeting">
            <div className="user-icon">{user?.name?.charAt(0) || 'U'}</div>
            <span>Welcome, {user?.name || 'User'}!</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="logout-button"
              onClick={() => onNavigate('myRecipes')}
            >
              My Recipes
            </button>
            <button className="logout-button" onClick={onLogout}>
              Sign Out
            </button>
          </div>
        </div>
        
        <div className="search-container">
          <h1 className="app-title">Recipe Collection</h1>
          <p className="app-subtitle">Discover and explore delicious recipes</p>

          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search recipes, ingredients, or instructions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={clearSearch} className="clear-button">
                ✕
              </button>
            )}
          </div>

          {/* Filter Tags */}
          <div className="filter-container">
            {filterOptions.map((option) => (
              <span
                key={option.value}
                className={`filter-badge ${
                  selectedFilter === option.value ? "active" : ""
                }`}
                onClick={() => setSelectedFilter(option.value)}
              >
                {option.label} ({option.count})
              </span>
            ))}
          </div>

          {/* Results Count */}
          <div className="results-info">
            {searchTerm || selectedFilter !== "all" ? (
              <p className="results-count">
                Showing {filteredRecipes.length} of {recipes.length} recipes
                {searchTerm && (
                  <span className="search-term"> for "{searchTerm}"</span>
                )}
              </p>
            ) : (
              <p className="results-count">Showing all {recipes.length} recipes</p>
            )}
          </div>

          {/* Add Recipe Button */}
          <button
            className="add-recipe-button"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "✕ Close Form" : "➕ Add New Recipe"}
          </button>

          {/* Input Form */}
          {showForm && <RecipeInput onAddRecipe={addRecipe} />}
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="recipe-container">
        {filteredRecipes.length === 0 ? (
          <div className="no-results">
            <div className="no-results-content">
              <h3 className="no-results-title">No recipes found</h3>
              <p className="no-results-text">
                Try adjusting your search terms or filters to find more recipes.
              </p>
              <button onClick={clearSearch} className="clear-filters-button">
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onRate={handleRateRecipe} />
          ))
        )}
      </div>
    </div>
  );
}
