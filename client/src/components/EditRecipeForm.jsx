import { useState, useEffect } from "react";
import { updateRecipe } from "../services/api";
import "../styles.css";

export default function EditRecipeForm({ recipe, onUpdate, onCancel }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setIngredients(recipe.ingredients.join(", "));
      setInstructions(recipe.instructions.join(". "));
      setIsPublic(recipe.public);
    }
  }, [recipe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const updatedRecipe = {
      title,
      ingredients: ingredients.split(",").map((ing) => ing.trim()),
      instructions: instructions.split(".").map((step) => step.trim()).filter(Boolean),
      public: isPublic,
    };

    try {
      const res = await updateRecipe(recipe._id, updatedRecipe);
      onUpdate(res);
    } catch (err) {
      console.error("Error updating recipe:", err);
      setError("Failed to update recipe. Please try again.");
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: 'rgba(0, 0, 0, 0.5)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      zIndex: 1000,
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <form onSubmit={handleSubmit} className="recipe-form" style={{ 
        maxWidth: '600px', 
        width: '100%',
        margin: '2rem auto',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2>Edit Recipe</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="edit-recipe-title">Recipe Title</label>
          <input
            id="edit-recipe-title"
            type="text"
            placeholder="Enter a name for your recipe"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="edit-recipe-ingredients">Ingredients</label>
          <small>Separate ingredients with commas</small>
          <textarea
            id="edit-recipe-ingredients"
            placeholder="Eggs, Milk, Flour, Sugar..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            rows="6"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="edit-recipe-instructions">Cooking Instructions</label>
          <small>End each step with a period</small>
          <textarea
            id="edit-recipe-instructions"
            placeholder="Mix the ingredients. Bake for 20 minutes. Let it cool."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            rows="8"
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              style={{ width: 'auto', margin: 0 }}
            />
            <span>Make this recipe public</span>
          </label>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" style={{ flex: 1 }}>Save Changes</button>
          <button 
            type="button" 
            onClick={onCancel}
            style={{ 
              flex: 1,
              background: '#6b7280',
              backgroundImage: 'none'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}