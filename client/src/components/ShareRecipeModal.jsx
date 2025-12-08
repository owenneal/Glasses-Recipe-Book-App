import React, { useState } from 'react';
import '../styles.css';

export default function ShareRecipeModal({ recipe, onShare, onClose }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onShare(recipe._id, email);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to share recipe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="share-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Share Recipe</h2>
                <p className="share-subtitle">Share "{recipe.title}" via email</p>

                {success ? (
                    <div className="success-message">
                        ✓ Recipe shared successfully!
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}
                        
                        <div className="form-group">
                            <label htmlFor="recipient-email">Recipient Email</label>
                            <input
                                id="recipient-email"
                                type="email"
                                placeholder="Enter recipient's email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <small>Allowed domains: gmail.com, outlook.com, yahoo.com</small>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button 
                                type="submit" 
                                style={{ flex: 1 }}
                                disabled={loading}
                            >
                                {loading ? 'Sharing...' : '📧 Share Recipe'}
                            </button>
                            <button 
                                type="button" 
                                onClick={onClose}
                                disabled={loading}
                                style={{ 
                                    flex: 1,
                                    background: '#6b7280',
                                    backgroundImage: 'none'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}