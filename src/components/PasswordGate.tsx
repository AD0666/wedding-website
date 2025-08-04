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

      {/* Scrollable Right Side - Wedding Details & Additional Sections */}
      <div className="password-gate-right">
        <FloatingFlowers />
        
        {/* Main Content Container */}
        <div className="password-gate-content-wrapper">
          
          {/* Section 1: Welcome & Password */}
          <section className="content-section" id="welcome">
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
          </section>

          {/* Section 2: Our Story */}
          <section className="content-section" id="our-story">
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
            <div className="section-content">
              <h2 className="section-title">Event Details</h2>
              <div className="event-details-grid">
                <div className="event-card">
                  <h3>Wedding Ceremony</h3>
                  <p className="event-time">2:00 PM - 4:00 PM</p>
                  <p className="event-location">St. Mary's Church, Jowai</p>
                  <p className="event-description">Join us for our traditional wedding ceremony</p>
                </div>
                <div className="event-card">
                  <h3>Reception</h3>
                  <p className="event-time">6:00 PM - 11:00 PM</p>
                  <p className="event-location">Grand Hotel, Jowai</p>
                  <p className="event-description">Celebrate with dinner, dancing, and joy</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: RSVP */}
          <section className="content-section" id="rsvp">
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
                    <label htmlFor="rsvp-email">Email</label>
                    <input type="email" id="rsvp-email" placeholder="Enter your email" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="rsvp-attendance">Will you attend?</label>
                    <select id="rsvp-attendance">
                      <option value="">Please select</option>
                      <option value="yes">Yes, I will attend</option>
                      <option value="no">No, I cannot attend</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="rsvp-guests">Number of Guests</label>
                    <input type="number" id="rsvp-guests" min="1" max="5" placeholder="1" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="rsvp-message">Message (Optional)</label>
                    <textarea id="rsvp-message" placeholder="Share your thoughts or special requests"></textarea>
                  </div>
                  <button type="submit" className="rsvp-submit">Send RSVP</button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Gallery */}
          <section className="content-section" id="gallery">
            <div className="section-content">
              <h2 className="section-title">Gallery</h2>
              <div className="gallery-content">
                <p>Take a look at some of our favorite moments together.</p>
                <div className="gallery-grid">
                  <div className="gallery-item">
                    <div className="gallery-placeholder">Photo 1</div>
                  </div>
                  <div className="gallery-item">
                    <div className="gallery-placeholder">Photo 2</div>
                  </div>
                  <div className="gallery-item">
                    <div className="gallery-placeholder">Photo 3</div>
                  </div>
                  <div className="gallery-item">
                    <div className="gallery-placeholder">Photo 4</div>
                  </div>
                  <div className="gallery-item">
                    <div className="gallery-placeholder">Photo 5</div>
                  </div>
                  <div className="gallery-item">
                    <div className="gallery-placeholder">Photo 6</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Contact */}
          <section className="content-section" id="contact">
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
      </div>
    </div>
  );
};

export default PasswordGate; 