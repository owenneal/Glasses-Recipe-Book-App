import React, { useState} from 'react';
import api from '../services/api';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            onLogin(res.data.token, res.data.user);
        } catch (err) {
            setError(err.response?.data?.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required />
            <button type="submit">Login</button>
            {error && <p className="error">{error}</p>}
        </form>
    );
}