import React, { useState, useEffect } from 'react';

interface CouplePhotoGalleryProps {
  onPhotoLoad?: () => void;
}

const CouplePhotoGallery: React.FC<CouplePhotoGalleryProps> = ({ onPhotoLoad }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch available couple photos
  useEffect(() => {
    const fetchCouplePhotos = async () => {
      try {
        // Use relative path to leverage the proxy setting in package.json
        const response = await fetch('/couple-photos');
        console.log('Fetching couple photos from: /couple-photos');
        
        const data = await response.json();
        console.log('Couple photos response:', data);
        
        if (data.photos && data.photos.length > 0) {
          console.log('Setting couple photos:', data.photos);
          setPhotos(data.photos);
        } else {
          console.log('No couple photos found, using fallback');
          // Fallback to default photos if no couple photos found
          setPhotos([
            '/uploads/bride-groom/bride.jpg',
            '/uploads/bride-groom/groom.jpg'
          ]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching couple photos:', error);
        console.log('Using fallback couple photos');
        // Fallback to default photos
        setPhotos([
          '/uploads/bride-groom/bride.jpg',
          '/uploads/bride-groom/groom.jpg'
        ]);
        setLoading(false);
      }
    };

    fetchCouplePhotos();
  }, []);

  // Auto-cycle through photos every 20 seconds
  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) => 
        prevIndex === photos.length - 1 ? 0 : prevIndex + 1
      );
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, [photos.length]);

  // Handle photo load
  const handlePhotoLoad = () => {
    if (onPhotoLoad) {
      onPhotoLoad();
    }
  };

  if (loading) {
    return (
      <div className="couple-photos">
        <div className="couple-photo-placeholder">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="couple-photos">
      
      {photos.map((photo, index) => (
        <img
          key={photo}
          src={photo}
          alt={`Couple Photo ${index + 1}`}
          className={`couple-photo ${index === currentPhotoIndex ? 'active' : 'inactive'}`}
          onLoad={() => {
            console.log('Photo loaded successfully:', photo);
            handlePhotoLoad();
          }}
          onError={(e) => {
            console.error('Failed to load photo:', photo);
            e.currentTarget.style.display = 'none';
          }}
          style={{
            opacity: index === currentPhotoIndex ? 1 : 0,
            transition: 'opacity 1s ease-in-out'
          }}
        />
      ))}
      
      {/* Photo indicator dots */}
      {photos.length > 1 && (
        <div className="photo-indicators">
          {photos.map((_, index) => (
            <div
              key={index}
              className={`photo-dot ${index === currentPhotoIndex ? 'active' : ''}`}
              onClick={() => setCurrentPhotoIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CouplePhotoGallery; 