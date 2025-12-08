// main app component
// page structure and routing would go here
// should probably just be UI
import React, { useState } from 'react';
import Main from './components/Main';
import Landing from './components/Landing';
import MyRecipes from './components/MyRecipes';
import RecipeDetails from './components/RecipeDetails';
//import { shareRecipe } from './services/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('main');
  const [previousPage, setPreviousPage] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);


  const handleAuth = (jwt, userObj) => {
    setToken(jwt);
    setUser(userObj);
    localStorage.setItem('token', jwt);
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    setCurrentPage('main');
  };

  const handleViewRecipe = (recipe) => {
    setPreviousPage(currentPage);
    setSelectedRecipe(recipe);
    setCurrentPage('details');
  }

  const handleBack = () => {
    setCurrentPage(previousPage || 'main');
    setSelectedRecipe(null);
  }

 
  return (
    <div className="App">
      {!token
        ? <Landing onAuth={handleAuth} />
        : (
          <>
            {currentPage === 'main' && (
              <Main 
                user={user} 
                onLogout={handleLogout} 
                onNavigate={setCurrentPage} 
                onViewRecipe={handleViewRecipe} // Pass handler
              />
            )}
            {currentPage === 'myRecipes' && (
              <MyRecipes 
                user={user} 
                onNavigate={setCurrentPage} 
                onLogout={handleLogout}
                onViewRecipe={handleViewRecipe} // Pass handler
              />
            )}
            {currentPage === 'details' && (
              <RecipeDetails 
                recipe={selectedRecipe} 
                onBack={handleBack}
                onShare={(r) => console.log("Share from details not fully implemented yet, use card")} 
              />
            )}
          </>
        )
      }
    </div>
  );
}

export default App;