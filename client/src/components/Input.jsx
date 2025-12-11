import { useState } from "react";
import { createRecipe } from "../services/api";

const categories = ['Dessert', 'Main Course', 'Salad', 'Appetizer', 'Soup', 'Breakfast', 'Uncategorized'];

export default function RecipeInput({ onAddRecipe }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRecipe = {
      title,
      ingredients: ingredients.split(",").map((ing) => ing.trim()),
      instructions: steps.split(".").map((step) => step.trim()).filter(Boolean),
      public: isPublic,
      category: category,

    };

    try {
      const res = await createRecipe(newRecipe);
      onAddRecipe(res);
      setTitle("");
      setIngredients("");
      setSteps("");
      setCategory("Uncategorized");
      setIsPublic(true);

    } catch (err) {
      console.error("Error:", err);
    }

  };

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <h2>Create a New Recipe</h2>
      
      <div className="form-group">
        <label htmlFor="recipe-title">Recipe Title</label>
        <input
          id="recipe-title"
          type="text"
          placeholder="Enter a name for your recipe"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>


      <div className="form-group">
        <label htmlFor="recipe-category">Category</label>
        <select 
          id="recipe-category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem' }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="recipe-ingredients">Ingredients</label>
        <small>Separate ingredients with commas</small>
        <textarea
          id="recipe-ingredients"
          placeholder="Eggs, Milk, Flour, Sugar..."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="recipe-steps">Cooking Instructions</label>
        <small>End each step with a period</small>
        <textarea
          id="recipe-steps"
          placeholder="Mix the ingredients. Bake for 20 minutes. Let it cool."
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          required
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
        <small style={{ marginTop: '0.25rem', display: 'block' }}>
          Public recipes can be viewed and rated by other users
        </small>
      </div>
      
      <button type="submit">Save Recipe</button>
    </form>
  );
}
