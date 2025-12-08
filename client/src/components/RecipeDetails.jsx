import React from 'react';
import '../styles.css';

export default function RecipeDetails({ recipe, onBack, onShare }) {
  if (!recipe) return null;

  return (
    <div className="app-container">
      <div className="details-container">
        <button className="back-button" onClick={onBack}>
          ← Back to Recipes
        </button>

        <div className="details-card">
          <div className="details-header">
            <h1 className="details-title">{recipe.title}</h1>
            <div className="details-meta">
              <span className="details-author">By: {recipe.author?.name || 'Unknown'}</span>
              <span className="details-rating">
                ⭐ {recipe.averageRating ? recipe.averageRating.toFixed(1) : 'No ratings'} 
                ({recipe.ratings?.length || 0} reviews)
              </span>
            </div>
          </div>

          <div className="details-content">
            <div className="details-section">
              <h3>🥘 Ingredients</h3>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="ingredient-item">• {ing}</li>
                ))}
              </ul>
            </div>

            <div className="details-section">
              <h3>📝 Instructions</h3>
              <ol className="instructions-list">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="instruction-item">
                    <span className="step-number">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="details-actions">
            <button className="share-button" onClick={() => onShare(recipe)}>
              📧 Share This Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}