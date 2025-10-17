import { useState } from "react";

export default function RecipeInput({ onAddRecipe }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRecipe = {
      id: Date.now(),
      title,
      ingredients: ingredients.split(",").map((ing) => ing.trim()),
      steps: steps.split(".").map((step) => step.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("http://localhost:5000/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
      });

      if (res.ok) {
        onAddRecipe(newRecipe);
      } else {
        console.error("Failed to save recipe");
      }
    } catch (err) {
      console.error("Error:", err);
    }

    setTitle("");
    setIngredients("");
    setSteps("");
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
      
      <button type="submit">Save Recipe</button>
    </form>
  );
}
