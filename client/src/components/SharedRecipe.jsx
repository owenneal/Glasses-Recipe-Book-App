import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles.css";

export default function SharedRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedRecipe, setEditedRecipe] = useState({
        title: "",
        ingredients: [],
        instructions: []
    });

    useEffect(() => {
        api.get(`/recipes/${id}`)
            .then(res => {
                setRecipe(res.data);
                setEditedRecipe({
                    title: res.data.title,
                    ingredients: res.data.ingredients,
                    instructions: res.data.instructions
                });
            })
            .catch(err => console.error(err));
    }, [id]);

    if (!recipe) return <p>Loading recipe...</p>;

    const handleChange = (field, value, index = null) => {
        if (field === "title") {
            setEditedRecipe(prev => ({ ...prev, title: value }));
        } else if (field === "ingredients") {
            const newIngredients = [...editedRecipe.ingredients];
            newIngredients[index] = value;
            setEditedRecipe(prev => ({ ...prev, ingredients: newIngredients }));
        } else if (field === "instructions") {
            const newInstructions = [...editedRecipe.instructions];
            newInstructions[index] = value;
            setEditedRecipe(prev => ({ ...prev, instructions: newInstructions }));
        }
    };

    const handleSave = () => {
        api.put(`/recipes/${recipe._id}`, {
            //_id: recipe._id,
            title: editedRecipe.title,
            ingredients: editedRecipe.ingredients,
            instructions: editedRecipe.instructions
        })
            .then(res => {
                setRecipe(res.data);
                setEditMode(false);
                alert("Recipe updated successfully!");
            })
            .catch(err => console.error("Error updating recipe:", err));
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            api.delete(`/recipes/${recipe._id}`)
                .then(() => {
                    alert("Recipe deleted!");
                    navigate("/");
                })
                .catch(err => console.error("Error deleting recipe:", err));
        }
    };


    return (
        <div className="app-container" style={{ paddingTop: "2rem" }}>
            <div className="recipe-container">
                <div className="recipe-card" style={{ maxWidth: "700px", margin: "0 auto" }}>
                    <div className="recipe-header">
                        {editMode ? (
                            <input
                                type="text"
                                value={editedRecipe.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                className="search-input"
                                style={{ fontSize: "1.5rem" }}
                            />
                        ) : (
                            <h2 className="recipe-title">{recipe.title}</h2>
                        )}
                    </div>

                    <div className="recipe-content">
                        <div className="ingredients-section">
                            <h3 className="section-title">🥘 Ingredients</h3>
                            {editMode ? (
                                editedRecipe.ingredients.map((ing, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        value={ing}
                                        onChange={(e) => handleChange("ingredients", e.target.value, i)}
                                        className="search-input"
                                        style={{ marginBottom: "0.5rem" }}
                                    />
                                ))
                            ) : (
                                <ul className="ingredients-list">
                                    {recipe.ingredients.map((ing, i) => (
                                        <li key={i} className="ingredient-item">• {ing}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="instructions-section">
                            <h3 className="section-title">📝 Instructions</h3>
                            {editMode ? (
                                editedRecipe.instructions.map((step, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        value={step}
                                        onChange={(e) => handleChange("instructions", e.target.value, i)}
                                        className="search-input"
                                        style={{ marginBottom: "0.5rem" }}
                                    />
                                ))
                            ) : (
                                <ol className="instructions-list">
                                    {recipe.instructions.map((step, i) => (
                                        <li key={i} className="instruction-item">{i + 1}. {step}</li>
                                    ))}
                                </ol>
                            )}
                        </div>

                        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                            {/* Share Button */}
                            <button
                                className="add-recipe-button"
                                onClick={() => {
                                    const shareUrl = `${window.location.origin}/share/${recipe._id}`;
                                    navigator.clipboard.writeText(shareUrl);
                                    alert("Recipe link copied to clipboard!");
                                }}
                            >
                                Share
                            </button>

                            {/* Edit / Save Button */}
                            <button
                                className="add-recipe-button"
                                onClick={() => {
                                    if (editMode) handleSave();
                                    setEditMode((prev) => !prev);
                                }}
                            >
                                {editMode ? "Save" : "Edit"}
                            </button>

                            {/* Delete Button */}
                            {!editMode && (
                                <button
                                    className="clear-filters-button"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}