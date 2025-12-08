import React, { useState, useEffect } from 'react';
import '../styles.css';



// helper function that will show the stars for a rating on the card
const StarRating = ({ rating, count, onRate, recipeId }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const fullStars = Math.round(rating);


  const handleRating = (rate) => {
      if (onRate) {
        onRate(recipeId, rate);
      }
  };

  const stars = [];
    for (let i = 1; i <= 5; i++) {
        let starClass = 'star';
        if (hoverRating >= i) {
            starClass += ' hover';
        } else if (!hoverRating && fullStars >= i) {
            starClass += ' filled';
        }

        stars.push(
            <span 
                key={i} 
                className={starClass}
                onClick={() => handleRating(i)}
                onMouseEnter={() => onRate && setHoverRating(i)}
                onMouseLeave={() => onRate && setHoverRating(0)}
            >
                ★
            </span>
        );
    }
  return (
      <div className="star-rating">
          {stars}
          <span className="rating-info">
              {rating > 0 ? `${rating.toFixed(1)} (${count} ratings)` : 'No ratings yet'}
          </span>
      </div>
  );
};



export default function RecipeCard({ recipe, children, onRate, onShare, onView, onFavorite, userFavorites}) {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {

    if (userFavorites && recipe) {
      setIsFavorited(userFavorites.includes(recipe._id));
    }
  }, [userFavorites, recipe]);

  const handleFavoriteClick = async () => {
    if (onFavorite) {
      await onFavorite(recipe._id);
      setIsFavorited(!isFavorited);
    }
  };
  if (!recipe) return null;

  return (
      <div className="recipe-card">
        {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} className="recipe-card-image" />}
    <div className="recipe-header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2 className="recipe-title">{recipe.title}</h2>
        {onFavorite && (
          <button 
            onClick={handleFavoriteClick}
            className={`favorite-icon ${isFavorited ? 'favorited' : ''}`}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
        )}
      </div>
      <StarRating 
                    rating={recipe.averageRating} 
                    count={recipe.ratings?.length || 0} 
                    onRate={onRate}
                    recipeId={recipe._id}
                />
        {recipe.category && <span className="recipe-category-tag">{recipe.category}</span>}
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

      {onView && (
        <button
        onClick={() => onView(recipe)}
        className="view-button"
      >
        👁️ View Recipe
      </button>
      )}

      {/* Share button for all recipes */}
      {onShare && (
        <button 
          onClick={() => onShare(recipe)}
          className="share-button"
        >
          📧 Share Recipe
        </button>
      )}



      {/* this is where action buttons (like Edit/Delete) will be rendered */}
      {children && <div className="recipe-actions" style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', gap: '1rem' }}>{children}</div>}
    </div>
  </div>
  );
}