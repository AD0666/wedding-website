import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HamburgerMenuProps {
  triggerFileInput: () => void;
  uploading: boolean;
  onLogout: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ 
  triggerFileInput, 
  uploading, 
  onLogout 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    closeMenu();
  };

  const handleUploadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    triggerFileInput();
    closeMenu();
  };

  const handleLogoutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onLogout();
    closeMenu();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.hamburger-menu-container')) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="hamburger-menu-container">
      {/* Hamburger Button */}
      <button 
        className={`hamburger-button ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Menu Overlay */}
      <div className={`hamburger-overlay ${isOpen ? 'active' : ''}`}>
        <div className="hamburger-menu" onClick={(e) => e.stopPropagation()}>
          <div className="hamburger-header">
            <h3>Menu</h3>
            <button 
              className="hamburger-close"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>
          
          <nav className="hamburger-nav">
            <a 
              href="#hero" 
              className="hamburger-nav-item"
              onClick={handleNavClick}
            >
              <span className="nav-icon">🏠</span>
              Home
            </a>
            
            <a 
              href="#our-story" 
              className="hamburger-nav-item"
              onClick={handleNavClick}
            >
              <span className="nav-icon">💕</span>
              Our Story
            </a>
            
            <a 
              href="#rsvp" 
              className="hamburger-nav-item"
              onClick={handleNavClick}
            >
              <span className="nav-icon">📝</span>
              RSVP
            </a>
            
            <a 
              href="#event-details" 
              className="hamburger-nav-item"
              onClick={handleNavClick}
            >
              <span className="nav-icon">📅</span>
              Event Details
            </a>
            
            <button 
              className="hamburger-nav-item upload-item"
              onClick={handleUploadClick}
              disabled={uploading}
            >
              <span className="nav-icon">📸</span>
              {uploading ? 'Uploading...' : 'Upload Photos'}
            </button>
            
            <Link 
              to="/collage" 
              className="hamburger-nav-item collage-item"
              onClick={closeMenu}
            >
              <span className="nav-icon">🎨</span>
              Collage
            </Link>
            
            <a 
              href="#gallery" 
              className="hamburger-nav-item"
              onClick={handleNavClick}
            >
              <span className="nav-icon">🖼️</span>
              Gallery
            </a>
            
            <a 
              href="#registry" 
              className="hamburger-nav-item"
              onClick={handleNavClick}
            >
              <span className="nav-icon">🎁</span>
              Registry
            </a>
            
            <button 
              className="hamburger-nav-item logout-item"
              onClick={handleLogoutClick}
            >
              <span className="nav-icon">🔒</span>
              Logout
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu; 