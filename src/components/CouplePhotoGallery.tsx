import React, { useState, useEffect, useCallback } from 'react';

interface CouplePhotoGalleryProps {
  onPhotoLoad?: () => void;
}

const CouplePhotoGallery: React.FC<CouplePhotoGalleryProps> = ({ onPhotoLoad }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedPhotos, setLoadedPhotos] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Preload images to prevent glitches
  const preloadImages = useCallback((imageUrls: string[]) => {
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        console.log('Preloaded image:', url);
        setLoadedPhotos(prev => new Set([...prev, url]));
      };
      img.onerror = () => {
        console.error('Failed to preload image:', url);
      };
    });
  }, []);

  // Fetch available couple photos
  useEffect(() => {
    const fetchCouplePhotos = async () => {
      try {
        // Use relative path to leverage the proxy setting in package.json
        const response = await fetch('/couple-photos');
        console.log('Fetching couple photos from: /couple-photos');
        
        const data = await response.json();
        console.log('Couple photos response:', data);
        
        let photoUrls: string[] = [];
        
        if (data.photos && data.photos.length > 0) {
          console.log('Setting couple photos:', data.photos);
          photoUrls = data.photos;
        } else {
          console.log('No couple photos found, using fallback');
          // Fallback to default photos if no couple photos found
          photoUrls = [
            '/uploads/bride-groom/bride.jpg',
            '/uploads/bride-groom/groom.jpg'
          ];
        }
        
        setPhotos(photoUrls);
        preloadImages(photoUrls);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching couple photos:', error);
        console.log('Using fallback couple photos');
        // Fallback to default photos
        const fallbackPhotos = [
          '/uploads/bride-groom/bride.jpg',
          '/uploads/bride-groom/groom.jpg'
        ];
        setPhotos(fallbackPhotos);
        preloadImages(fallbackPhotos);
        setLoading(false);
      }
    };

    fetchCouplePhotos();
  }, [preloadImages]);

  // Handle photo load
  const handlePhotoLoad = useCallback((photoUrl: string) => {
    console.log('Photo loaded successfully:', photoUrl);
    setLoadedPhotos(prev => new Set([...prev, photoUrl]));
    
    if (onPhotoLoad) {
      onPhotoLoad();
    }
  }, [onPhotoLoad]);

  // Handle photo error
  const handlePhotoError = useCallback((photoUrl: string) => {
    console.error('Failed to load photo:', photoUrl);
    // Remove failed photo from the array
    setPhotos(prev => prev.filter(photo => photo !== photoUrl));
  }, []);

  // Smooth photo transition
  const changePhoto = useCallback((newIndex: number) => {
    if (newIndex === currentPhotoIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Wait for transition to complete before updating index
    setTimeout(() => {
      setCurrentPhotoIndex(newIndex);
      setIsTransitioning(false);
    }, 500); // Half of the CSS transition duration
  }, [currentPhotoIndex, isTransitioning]);

  // Auto-cycle through photos every 20 seconds
  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = currentPhotoIndex === photos.length - 1 ? 0 : currentPhotoIndex + 1;
      changePhoto(nextIndex);
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, [photos.length, currentPhotoIndex, changePhoto]);

  // Handle manual dot click
  const handleDotClick = useCallback((index: number) => {
    changePhoto(index);
  }, [changePhoto]);

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
          onLoad={() => handlePhotoLoad(photo)}
          onError={() => handlePhotoError(photo)}
          style={{
            opacity: index === currentPhotoIndex ? 1 : 0,
            transform: index === currentPhotoIndex ? 'scale(1)' : 'scale(0.95)',
            transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
            zIndex: index === currentPhotoIndex ? 2 : 1
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
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CouplePhotoGallery; 