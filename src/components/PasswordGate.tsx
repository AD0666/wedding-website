import React, { useState, useEffect } from 'react';
import './PasswordGate.css';
import CouplePhotoGallery from './CouplePhotoGallery.tsx';
import CountdownTimer from './CountdownTimer.tsx';
import FloatingFlowers from './FloatingFlowers.tsx';

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
    <div 
      className="password-gate"
      role="main"
      aria-label="Wedding website password entry"
    >
      {/* Left Side - Couple Images */}
      <div className="password-gate-left">
        <div 
          className="couple-images"
          role="banner"
          aria-label="Couple introduction"
        >
          <h1 aria-label="Paiya and Risly wedding">Paiya weds Risly</h1>
          <p className="wedding-date">October 9, 2025</p>
          <CouplePhotoGallery />
        </div>
      </div>

      {/* Right Side - Wedding Details */}
      <div className="password-gate-right">
        <FloatingFlowers />
        <div className="password-gate-content">
          <div className="wedding-details">
            <div className="wedding-day">Thursday</div>
            <div className="wedding-date-main">October 9, 2025</div>
            <div className="wedding-location">Jowai, India</div>
            
            <CountdownTimer weddingDate={new Date('2025-10-09T00:00:00')} />
            
            <div className="password-form-container">
              <p>Please enter the password to view our special day</p>
              
              <form 
                onSubmit={handleSubmit} 
                className="password-form"
                role="form"
                aria-label="Password entry form"
              >
                <div className="password-input-group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    placeholder="Enter password"
                    className="password-input"
                    disabled={isLoading}
                    autoFocus
                    style={{ zIndex: 1000, position: 'relative' }}
                    aria-label="Enter wedding password"
                    aria-describedby="password-error"
                    aria-invalid={!!error}
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
                  <div id="password-error" className="password-error" role="alert" aria-live="polite">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate; 