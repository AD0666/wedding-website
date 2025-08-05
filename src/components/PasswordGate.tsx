import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [showRightSide, setShowRightSide] = useState(false);

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
      // Show the right side content
      setShowRightSide(true);
      setError('');
      setPassword('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
    setIsLoading(false);
  };

  // Check if user is already authenticated
  // useEffect(() => {
  //   const isAuthenticated = localStorage.getItem('weddingAuth') === 'true';
  //   if (isAuthenticated) {
  //     onPasswordCorrect();
  //   }
  // }, [onPasswordCorrect]);

  return (
    <div 
      className="password-gate"
      role="main"
      aria-label="Wedding website password entry"
    >
      {/* Fixed Left Side - Couple Images */}
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

      {/* Right Side with Envelope Overlay */}
      <div className="password-gate-right">
        {/* Envelope Overlay - shown when right side is hidden */}
        {!showRightSide && (
          <div className="envelope-overlay">
            <div className="envelope-content">
              <div className="envelope-icon">
                <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
                  {/* Envelope base */}
                  <rect x="5" y="15" width="70" height="40" rx="3" fill="#f8f9fa" stroke="#6c757d" strokeWidth="2"/>
                  {/* Envelope flap */}
                  <path d="M5 15 L40 35 L75 15" stroke="#6c757d" strokeWidth="2" fill="none"/>
                  {/* Envelope seal */}
                  <rect x="30" y="25" width="20" height="15" rx="2" fill="#e9ecef" stroke="#6c757d" strokeWidth="1"/>
                  {/* Lock icon */}
                  <rect x="35" y="30" width="10" height="8" rx="1" fill="#6c757d"/>
                  <circle cx="40" cy="34" r="1.5" fill="#fff"/>
                </svg>
              </div>
            
              <p className="envelope-message">Please enter the password to unlock our special day</p>
              
              <form 
                onSubmit={handleSubmit} 
                className="envelope-password-form"
                role="form"
                aria-label="Password entry form"
              >
                <div className="envelope-password-input-group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    placeholder="Enter password"
                    className="envelope-password-input"
                    disabled={isLoading}
                    autoFocus
                    aria-label="Enter wedding password"
                    aria-describedby="envelope-password-error"
                    aria-invalid={!!error}
                  />
                  <button 
                    type="submit" 
                    className="envelope-password-submit"
                    disabled={isLoading || !password.trim()}
                  >
                    {isLoading ? 'Unlocking...' : 'Unlock'}
                  </button>
                </div>
                
                {error && (
                  <div id="envelope-password-error" className="envelope-password-error" role="alert" aria-live="polite">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Right Side Content - shown when password is correct */}
        {showRightSide && (
          <>
            {/* Main Content Container */}
            <div className="password-gate-content-wrapper">
              
              {/* Section 1: Welcome & Password */}
              <section className="content-section" id="welcome">
                <FloatingFlowers />
                <div className="password-gate-content">
                  <div className="wedding-details">
                    <div className="wedding-day">Thursday</div>
                    <div className="wedding-date-main">October 9, 2025</div>
                    <div className="wedding-location">Jowai, India</div>
                    
                    <CountdownTimer weddingDate={new Date('2025-10-09T00:00:00')} />
                    
                    <div className="password-form-container">
                      <p>Welcome! You've unlocked our special day</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Our Story */}
              <section className="content-section" id="our-story">
                <FloatingFlowers />
                <div className="section-content">
                  <h2 className="section-title">Our Story</h2>
                  <div className="story-content">
                    <p>Every love story is beautiful, but ours is our favorite. From the first moment we met, we knew our lives would never be the same.</p>
                    <p>Through laughter and tears, adventures and quiet moments, we've grown together and discovered that true love is not just about finding the perfect person, but about seeing an imperfect person perfectly.</p>
                    <p>We can't wait to celebrate our love with all of you on our special day.</p>
                  </div>
                </div>
              </section>

              {/* Section 3: Event Details */}
              <section className="content-section" id="event-details">
                <FloatingFlowers />
                <div className="section-content">
                  <h2 className="section-title">Event Details</h2>
                  <div className="event-details-grid">
                    <div className="event-card">
                      <h3>Wedding Ceremony</h3>
                      <p className="event-time">2:00 PM - 4:00 PM</p>
                      <p className="event-location">St. Mary's Church, Jowai</p>
                      <p className="event-description">Join us for our traditional wedding ceremony</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: RSVP */}
              <section className="content-section" id="rsvp">
                <FloatingFlowers />
                <div className="section-content">
                  <h2 className="section-title">RSVP</h2>
                  <div className="rsvp-content">
                    <p>We would be honored by your presence at our wedding celebration.</p>
                    <div className="rsvp-form">
                      <div className="form-group">
                        <label htmlFor="rsvp-name">Full Name</label>
                        <input type="text" id="rsvp-name" placeholder="Enter your full name" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="rsvp-attendance">Will you attend?</label>
                        <select id="rsvp-attendance">
                          <option value="">Please select</option>
                          <option value="yes">Yes, I will attend</option>
                          <option value="maybe">Maybe, I'll let you know</option>
                          <option value="no">No, I cannot attend</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="rsvp-guests">Number of Guests</label>
                        <input type="number" id="rsvp-guests" min="1" max="5" placeholder="1" />
                      </div>
                      <button type="submit" className="rsvp-submit">Send RSVP</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5: Gallery */}
              <section className="content-section" id="gallery">
                <FloatingFlowers />
                <div className="section-content">
                  <h2 className="section-title">Gallery</h2>
                  <div className="gallery-content">
                    <p>Take a look at some of our favorite moments together.</p>
                    <Link to="/collage" className="gallery-button">
                      View Photo Gallery
                    </Link>
                  </div>
                </div>
              </section>

              {/* Section 6: Contact */}
              <section className="content-section" id="contact">
                <FloatingFlowers />
                <div className="section-content">
                  <h2 className="section-title">Contact Us</h2>
                  <div className="contact-content">
                    <p>Have questions? We'd love to hear from you!</p>
                    <div className="contact-info">
                      <div className="contact-item">
                        <h4>Paiya</h4>
                        <p>📧 paiya@email.com</p>
                        <p>📱 +91 98765 43210</p>
                      </div>
                      <div className="contact-item">
                        <h4>Risly</h4>
                        <p>📧 risly@email.com</p>
                        <p>📱 +91 98765 43211</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordGate; 