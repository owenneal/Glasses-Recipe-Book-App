import React from 'react';
import '../styles.css';

export default function RecipeCard({ recipe, children}) {
    if (!recipe) return null;

    return (
        <div className="recipe-card">
      <div className="recipe-header">
        <h2 className="recipe-title">{recipe.title}</h2>
      </div>
      <div className="recipe-content">
        <div className="ingredients-section">
          <h3 className="section-title">🥘 Ingredients</h3>
          <ul className="ingredients-list">
            {(recipe.ingredients || []).map((ing, i) => (
              <li key={i} className="ingredient-item">
                • {ing}
              </li>
            ))}
          </ul>
        </div>
        <div className="instructions-section">
          <h3 className="section-title">📝 Instructions</h3>
          <ol className="instructions-list">
            {(recipe.instructions || []).map((step, i) => (
              <li key={i} className="instruction-item">
                {i + 1}. {step}
              </li>
            ))}
          </ol>
        </div>
        {/* this is where action buttons (like Edit/Delete) will be rendered */}
        {children && <div className="recipe-actions" style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', gap: '1rem' }}>{children}</div>}
      </div>
    </div>
    );
}