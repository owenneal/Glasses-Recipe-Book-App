import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

export default function Landing({ onAuth }) {
    const [mode, setMode] = useState('login');

    return (
        <div className="landing">
            <div className="mode-switch">
                <button onClick={() => setMode('login')} className={mode === 'login' ? 'active' : ''}>Login</button>
                <button onClick={() => setMode('register')} className={mode === 'register' ? 'active' : ''}>Register</button>
            </div>
            {mode === 'login' ? <Login onLogin={onAuth} /> : <Register onRegister={onAuth} />}
        </div>
    );
}