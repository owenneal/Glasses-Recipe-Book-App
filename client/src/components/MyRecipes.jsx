import React, { useEffect, useState } from 'react';
import { getAllMyRecipes, updateRecipe, deleteRecipe } from '../services/api';
import RecipeCard from './RecipeCard';
import EditRecipeForm from './EditRecipeForm';
import '../styles.css';

export default function MyRecipes({ user, onLogout, onNavigate }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingRecipe, setEditingRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const userRecipes = await getAllMyRecipes();
                setRecipes(userRecipes);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);


    const handleDelete = async (recipeId) => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            try {
                await deleteRecipe(recipeId);
                setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
            } catch (error) {
                console.error("Error deleting recipe:", error);
                alert("Failed to delete recipe. Please try again.");
            }
        }
    };

    const handleUpdate = (updatedRecipe) => {
        setRecipes(recipes.map(recipe => 
            recipe._id === updatedRecipe._id ? updatedRecipe : recipe
        ));
        setEditingRecipe(null);
    };

    const handleCancelEdit = () => {
        setEditingRecipe(null);
    };

    return (
        <div className="app-container">
            <div className="search-header">
                {/* Welcome Bar with Navigation */}
                <div className="welcome-bar">
                    <div className="user-greeting">
                        <div className="user-icon">{user?.name?.charAt(0) || 'U'}</div>
                        <span>Welcome, {user?.name || 'User'}!</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="logout-button" onClick={() => onNavigate('main')}>
                            🏠 All Recipes
                        </button>
                        <button className="logout-button" onClick={onLogout}>
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="search-container">
                    <h1 className="app-title">My Recipes</h1>
                    <p className="app-subtitle">Your personal collection of recipes</p>
                </div>
            </div>

            <div className="recipe-container">
                {recipes.length > 0 ? (
                    recipes.map(recipe => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                    ))
                ) : (
                    <div className="no-results">
                        <div className="no-results-content">
                            <h3 className="no-results-title">No Recipes Yet</h3>
                            <p className="no-results-text">
                                You haven't created any recipes.
                            </p>
                            <button 
                                className="clear-filters-button"
                                onClick={() => onNavigate('main')}
                            >
                                Browse All Recipes
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}