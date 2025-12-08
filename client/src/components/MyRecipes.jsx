import React, { useEffect, useState } from 'react';
import { getAllMyRecipes, deleteRecipe, rateRecipe, shareRecipe, toggleFavorite, getFavoriteRecipes } from '../services/api';
import RecipeCard from './RecipeCard';
import EditRecipeForm from './EditRecipeForm';
import ShareRecipeModal from './ShareRecipeModal';
import RecipeCardSkeleton from './RecipeCardSkeleton';
import BackToTopButton from './BackToTopButton';
import '../styles.css';

export default function MyRecipes({ user, onLogout, onNavigate, onViewRecipe }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [sharingRecipe, setSharingRecipe] = useState(null);
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [filterMode, setFilterMode] = useState('all');
    const [userFavoriteIds, setUserFavoriteIds] = useState([]);
 
    const handleShareRecipe = (recipe) => {
        setSharingRecipe(recipe);
    };

    const handleShareSubmit = async (recipeId, email) => {
        await shareRecipe(recipeId, email);
    };

    const handleCloseShareModal = () => {
        setSharingRecipe(null);
    };

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const userRecipes = await getAllMyRecipes();
                const favorites = await getFavoriteRecipes();
                setRecipes(userRecipes || []);
                setFavoriteRecipes(favorites || []);
                setUserFavoriteIds((favorites || []).map(f => f._id));
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    const handleFavorite = async (recipeId) => {
        try {
            const result = await toggleFavorite(recipeId);
            
            if (result.isFavorite) {
                const favorites = await getFavoriteRecipes();
                setFavoriteRecipes(favorites || []);
                setUserFavoriteIds(favorites ? favorites.map(f => f._id) : []);
            } else {
                setFavoriteRecipes(favoriteRecipes.filter(r => r._id !== recipeId));
                setUserFavoriteIds(userFavoriteIds.filter(id => id !== recipeId));
            }
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
            alert("An error occurred while updating favorites.");
        }
    };


    const handleEdit = (recipe) => {
        setEditingRecipe(recipe);
    };


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

    const handleRateRecipe = async (recipeId, rating) => {
        try {
            const updatedRecipe = await rateRecipe(recipeId, rating);
            setRecipes(prevRecipes => 
                prevRecipes.map(r => (r._id === recipeId ? updatedRecipe : r))
            );
        } catch (error) {
            console.error("Failed to rate recipe:", error);
            alert(error.response?.data?.message || "An error occurred while rating.");
        }
    };


     const displayedRecipes = (() => {
        switch (filterMode) {
            case 'created':
                return recipes;
            case 'favorites':
                return favoriteRecipes;
            case 'all':
            default:
                const allRecipes = [...recipes];
                favoriteRecipes.forEach(fav => {
                    if (!allRecipes.find(r => r._id === fav._id)) {
                        allRecipes.push(fav);
                    }
                });
                return allRecipes;
        }
    })();


    if (loading) {
        return (
            <div className="app-container">
                <div className="recipe-container" style={{ paddingTop: '2rem' }}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <RecipeCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-container">
                <p>Error loading recipes: {error.message}</p>
            </div>
        );
    }



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

                {/* Filter Tabs */}
                <div className="recipe-filter-tabs">
                    <button 
                        className={`filter-tab ${filterMode === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterMode('all')}
                    >
                        All ({recipes.length + favoriteRecipes.filter(f => !recipes.find(r => r._id === f._id)).length})
                    </button>
                    <button 
                        className={`filter-tab ${filterMode === 'created' ? 'active' : ''}`}
                        onClick={() => setFilterMode('created')}
                    >
                        Created ({recipes.length})
                    </button>
                    <button 
                        className={`filter-tab ${filterMode === 'favorites' ? 'active' : ''}`}
                        onClick={() => setFilterMode('favorites')}
                    >
                        Favorites ({favoriteRecipes.length})
                    </button>
                </div>
            </div>

            {/*Recipe grid or no results message*/}
            <div className="recipe-container">
                {displayedRecipes.length > 0 ? (
                    displayedRecipes.map(recipe => {
                        const isOwnRecipe = recipes.find(r => r._id === recipe._id);
                        
                        return (
                            <RecipeCard 
                                key={recipe._id} 
                                recipe={recipe} 
                                onRate={handleRateRecipe} 
                                onShare={handleShareRecipe} 
                                onView={onViewRecipe}
                                onFavorite={handleFavorite}
                                userFavorites={userFavoriteIds}
                            >
                                {isOwnRecipe && (
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <button 
                                            className="edit-button"
                                            onClick={() => handleEdit(recipe)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button 
                                            className="delete-button"
                                            onClick={() => handleDelete(recipe._id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                )}
                            </RecipeCard>
                        );
                    })
                ) : (
                    <div className="no-results">
                        <div className="no-results-content">
                            <h3 className="no-results-title">
                                {filterMode === 'favorites' ? 'No Favorite Recipes' : 'No Recipes Yet'}
                            </h3>
                            <p className="no-results-text">
                                {filterMode === 'favorites' 
                                    ? "You haven't favorited any recipes yet. Browse all recipes to find some you love!"
                                    : "You haven't created any recipes."}
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

            {/* edit recipe area */}
            {editingRecipe && (
                <EditRecipeForm
                    recipe={editingRecipe}
                    onUpdate={handleUpdate}
                    onCancel={handleCancelEdit}
                />
            )}

            {sharingRecipe && (
                <ShareRecipeModal
                    recipe={sharingRecipe}
                    onClose={handleCloseShareModal}
                    onShare={handleShareSubmit}
                />
            )}
            <BackToTopButton />
        </div>
    );
}