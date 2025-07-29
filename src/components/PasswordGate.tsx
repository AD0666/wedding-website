import React, { useState, useEffect } from 'react';
import './PasswordGate.css';
import CouplePhotoGallery from './CouplePhotoGallery.tsx';
import TestComponent from './TestComponent';

interface PasswordGateProps {
  onPasswordCorrect: () => void;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ onPasswordCorrect }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // The generic password for all users
  const CORRECT_PASSWORD = 'wedding2025';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === CORRECT_PASSWORD) {
      // Store authentication in localStorage
      localStorage.setItem('weddingAuth', 'true');
      onPasswordCorrect();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
    setIsLoading(false);
  };

  // Check if user is already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('weddingAuth') === 'true';
    if (isAuthenticated) {
      onPasswordCorrect();
    }
  }, [onPasswordCorrect]);



  return (
    <div className="password-gate">
      {/* Left Side - Couple Images */}
      <div className="password-gate-left">
        <div className="couple-images">
          <h1>Paiya weds Risly</h1>
          <p className="wedding-date">October 9, 2025</p>
          <CouplePhotoGallery />
        </div>
      </div>

      {/* Right Side - Password Form */}
      <div className="password-gate-right">
        <div className="password-gate-content">
          <h2>Welcome</h2>
          
          <div className="wedding-hearts">
            <span>💕</span>
            <span>💍</span>
            <span>💕</span>
          </div>
          
          <div className="password-form-container">
            <p>Please enter the password to view our special day</p>
            
            <form onSubmit={handleSubmit} className="password-form">
              <div className="password-input-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    console.log('Password input changed:', e.target.value);
                    setPassword(e.target.value);
                  }}
                  placeholder="Enter password"
                  className="password-input"
                  disabled={isLoading}
                  autoFocus
                  style={{ zIndex: 1000, position: 'relative' }}
                />
                <button 
                  type="submit" 
                  className="password-submit"
                  disabled={isLoading || !password.trim()}
                >
                  {isLoading ? 'Entering...' : 'Enter'}
                </button>
              </div>
              

              
              {error && (
                <div className="password-error">
                  {error}
                </div>
              )}
            </form>
          </div>

          <div className="password-gate-footer">
            <p>With love, Paiya & Risly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate; 