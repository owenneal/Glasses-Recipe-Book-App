import { useEffect, useState, useMemo } from "react";
import "../styles.css";
import RecipeInput from "./Input";
import api from "../services/api";

export default function Main({ user, onLogout }) {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  // Load from backend instead of mockdata.js
  useEffect(() => {
    api.get('/recipes/public')
      .then((res) => res.json())
      .then((data) => setRecipes(data.recipes))
      .catch((err) => console.error("Failed to load recipes", err));
  }, []);

  // Add new recipe to state
  const addRecipe = (newRecipe) => {
    setRecipes((prev) => [...prev, newRecipe]);
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
          <button className="logout-button" onClick={onLogout}>
            Sign Out
          </button>
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
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-header">
                <h2 className="recipe-title">{recipe.title}</h2>
              </div>
              <div className="recipe-content">
                <div className="ingredients-section">
                  <h3 className="section-title">🥘 Ingredients</h3>
                  <ul className="ingredients-list">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="ingredient-item">
                        • {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="instructions-section">
                  <h3 className="section-title">📝 Instructions</h3>
                  <ol className="instructions-list">
                    {recipe.instructions.map((step, i) => (
                      <li key={i} className="instruction-item">
                        {i + 1}. {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
