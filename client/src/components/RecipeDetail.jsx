import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles.css";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState({
    title: "",
    ingredients: [],
    instructions: [],
  });

  useEffect(() => {
    api.get(`/recipes/${id}`)
      .then((res) => {
        setRecipe(res.data);
        setEditedRecipe(res.data);
      })
      .catch((err) => console.error("Failed to load recipe:", err));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await api.delete(`/recipes/${id}`);
      alert("Recipe deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete recipe:", err);
      alert("Error deleting recipe.");
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/recipes/${id}`, editedRecipe);
      setRecipe(editedRecipe);
      setIsEditing(false);
      alert("Recipe updated!");
    } catch (err) {
      console.error("Failed to update recipe:", err);
      alert("Error saving recipe.");
    }
  };

  const handleChange = (field, value) => {
    setEditedRecipe((prev) => ({ ...prev, [field]: value }));
  };

  if (!recipe) return <p>Loading recipe...</p>;

  return (
    <div className="recipe-detail-page">
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅ Back to Recipes
      </button>

      {!isEditing ? (
        <>
          <h1 className="recipe-detail-title">{recipe.title}</h1>

          <div className="recipe-detail-section">
            <h3>🥘 Ingredients</h3>
            <ul>
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>

          <div className="recipe-detail-section">
            <h3>📝 Instructions</h3>
            <ol>
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="detail-buttons">
            <button
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Recipe
            </button>
            <button
              className="delete-button"
              onClick={handleDelete}
            >
              🗑️ Delete Recipe
            </button>
          </div>
        </>
      ) : (
        <div className="edit-form">
          <h2>Edit Recipe</h2>
          <input
            className="input-field"
            type="text"
            value={editedRecipe.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <textarea
            className="input-area"
            value={editedRecipe.ingredients.join("\n")}
            onChange={(e) =>
              handleChange("ingredients", e.target.value.split("\n"))
            }
            placeholder="Enter one ingredient per line"
          />

          <textarea
            className="input-area"
            value={editedRecipe.instructions.join("\n")}
            onChange={(e) =>
              handleChange("instructions", e.target.value.split("\n"))
            }
            placeholder="Enter one instruction per line"
          />

          <div className="edit-buttons">
            <button className="save-button" onClick={handleSave}>
              💾 Save
            </button>
            <button
              className="cancel-button"
              onClick={() => setIsEditing(false)}
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}