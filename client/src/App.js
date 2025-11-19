// main app component
// page structure and routing would go here
// should probably just be UI



import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from './components/Main';
import Landing from './components/Landing';
import SharedRecipe from "./components/SharedRecipe";
import RecipeDetail from "./components/RecipeDetail";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);


  const handleAuth = (jwt, userObj) => {
    setToken(jwt);
    setUser(userObj);
    localStorage.setItem('token', jwt);
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="App">
        {!token ? (
          <Landing onAuth={handleAuth} />
        ) : (
          <Routes>
            <Route path="/" element={<Main user={user} onLogout={handleLogout} />} />
            <Route path="/share/:id" element={<SharedRecipe />} />
            <Route path="/recipe/:id" element={<RecipeDetail user={user} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;