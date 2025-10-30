// main app component
// page structure and routing would go here
// should probably just be UI



import React, { useState } from 'react';
import Main from './components/Main';
import Landing from './components/Landing';
import MyRecipes from './components/MyRecipes';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('main');


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

  return (
    <div className="App">
      {!token
        ? <Landing onAuth={handleAuth} />
        : (
          <>
            {currentPage === 'main' ? (
              <Main user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
            ) : ( 
              <MyRecipes user={user} onNavigate={setCurrentPage} />
            )}
          </>
        )
      }
    </div>
  );
}

export default App;