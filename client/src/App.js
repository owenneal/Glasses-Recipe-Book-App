// main app component
// page structure and routing would go here
// should probably just be UI



import React, { useState } from 'react';
import Main from './components/Main';
import Landing from './components/Landing';

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
    <div className="App">
      {!token
        ? <Landing onAuth={handleAuth} />
        : (
          <>
            <Main user={user} onLogout={handleLogout} />
          </>
        )
      }
    </div>
  );
}

export default App;