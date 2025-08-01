import React, { useEffect, useState, useRef } from 'react';
import './CollagePage.css';

const RESERVED = {
  x: 0.25, // 25% from left
  y: 0.25, // 25% from top
  w: 0.5,  // 50% width
  h: 0.5,  // 50% height
};

function getRandomPosition(idx, total) {
  let x, y;
  let tries = 0;
  do {
    x = Math.random() * 0.9 + 0.05;
    y = Math.random() * 0.9 + 0.05;
    tries++;
  } while (
    x > RESERVED.x && x < RESERVED.x + RESERVED.w &&
    y > RESERVED.y && y < RESERVED.y + RESERVED.h &&
    tries < 10
  );
  return {
    x, y,
    rot: Math.random() * 30 - 15,
    scale: 0.95 + Math.random() * 0.1,
    z: Math.floor(Math.random() * 10),
    delay: idx * 0.04,
  };
}

// --- Animated White Flowers and Rose Petals Canvas ---
function drawFlower(ctx, x, y, size, rot, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
  ctx.rotate(rot);
  // Draw a simple 5-petal white flower
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.ellipse(0, size * 0.3, size * 0.12, size * 0.3, 0, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#e0e0e0';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.rotate((2 * Math.PI) / 5);
  }
  // Center
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.09, 0, 2 * Math.PI);
  ctx.fillStyle = '#fffbe7';
  ctx.shadowBlur = 0;
  ctx.fill();
  ctx.restore();
}

function drawPetal(ctx, x, y, size, rot, color, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-size * 0.3, -size * 0.5, size * 0.3, -size * 0.5, 0, 0);
  ctx.bezierCurveTo(size * 0.4, size * 0.7, -size * 0.4, size * 0.7, 0, 0);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.shadowColor = color + '88';
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();
}

function CollageFlowerCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // Smaller, more flowers
    let flowers = Array.from({ length: 24 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 18 + Math.random() * 18, // smaller
      rot: Math.random() * Math.PI * 2,
      speed: 0.08 + Math.random() * 0.12,
      drift: (Math.random() - 0.5) * 0.15,
      opacity: 0.4 + Math.random() * 0.3,
      rotSpeed: (Math.random() - 0.5) * 0.002,
    }));
    // Rose petals
    let petals = Array.from({ length: 22 }, () => {
      const colors = ['#e63946', '#f48fb1', '#f06292', '#d72660'];
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 16 + Math.random() * 18,
        rot: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.12 + Math.random() * 0.18,
        sway: (Math.random() - 0.5) * 0.7,
        swayPhase: Math.random() * Math.PI * 2,
        opacity: 0.5 + Math.random() * 0.3,
        rotSpeed: (Math.random() - 0.5) * 0.006,
      };
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Flowers
      for (let f of flowers) {
        drawFlower(ctx, f.x, f.y, f.size, f.rot, f.opacity);
        f.y -= f.speed;
        f.x += f.drift;
        f.rot += f.rotSpeed;
        if (f.y < -f.size) {
          f.y = window.innerHeight + f.size;
          f.x = Math.random() * window.innerWidth;
        }
        if (f.x < -f.size) f.x = window.innerWidth + f.size;
        if (f.x > window.innerWidth + f.size) f.x = -f.size;
      }
      // Petals
      for (let p of petals) {
        const swayX = Math.sin(Date.now() / 900 + p.swayPhase) * p.sway * 12;
        drawPetal(ctx, p.x + swayX, p.y, p.size, p.rot, p.color, p.opacity);
        p.y += p.speed;
        p.rot += p.rotSpeed;
        if (p.y > window.innerHeight + p.size) {
          p.y = -p.size;
          p.x = Math.random() * window.innerWidth;
          p.swayPhase = Math.random() * Math.PI * 2;
        }
        if (p.x < -p.size) p.x = window.innerWidth + p.size;
        if (p.x > window.innerWidth + p.size) p.x = -p.size;
      }
      requestAnimationFrame(animate);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    animate();

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="collage-flower-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
// --- End Animated White Flowers and Rose Petals Canvas ---

// --- Animated Petals/Confetti for Bride & Groom Section ---

export default function CollagePage() {
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState({});
  const [positions, setPositions] = useState([]);
  const [brideGroom, setBrideGroom] = useState(null);
  const [hovered, setHovered] = useState({});
  const [showFeatured, setShowFeatured] = useState(false);
  const [featured, setFeatured] = useState(null);
  const featuredTimeoutRef = useRef();
  const featuredIntervalRef = useRef();
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef();
  const uploadBtnRef = useRef();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPrivacy, setUploadPrivacy] = useState('public');

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL;
    fetch(`${API_URL}/public-photos`)
      .then(res => res.json())
      .then(imgs => {
        setImages(imgs);
        setPositions(imgs.map((_, idx) => getRandomPosition(idx, imgs.length)));
      });
    fetch(`${API_URL}/bride-groom-photos`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(setBrideGroom)
      .catch((error) => {
        console.error('Failed to fetch bride-groom data:', error);
        setBrideGroom(null);
      });
  }, []);

  // Show featured photo every 20 seconds, only from loaded images
  useEffect(() => {
    const loadedImages = images.filter((img, idx) => loaded[img.thumbnail + idx]);
    if (loadedImages.length === 0) return;
    function showFeaturedPhoto() {
      let next = loadedImages[Math.floor(Math.random() * loadedImages.length)];
      setFeatured(next);
      setShowFeatured(true);
      clearTimeout(featuredTimeoutRef.current);
      featuredTimeoutRef.current = setTimeout(() => setShowFeatured(false), 2500);
    }
    // Show immediately on mount
    showFeaturedPhoto();
    // Then every 20 seconds
    clearInterval(featuredIntervalRef.current);
    featuredIntervalRef.current = setInterval(showFeaturedPhoto, 20000);
    return () => {
      clearInterval(featuredIntervalRef.current);
      clearTimeout(featuredTimeoutRef.current);
    };
  }, [images, loaded]);

  // Dismiss featured on user interaction or image error
  useEffect(() => {
    if (!showFeatured) return;
    const dismiss = () => setShowFeatured(false);
    window.addEventListener('keydown', dismiss);
    window.addEventListener('mousedown', dismiss);
    return () => {
      window.removeEventListener('keydown', dismiss);
      window.removeEventListener('mousedown', dismiss);
    };
  }, [showFeatured]);

  // Upload handler (directly add images to collage)
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const endpoint = `${API_URL}${uploadPrivacy === 'private' ? '/upload/private' : '/upload/public'}`;
      await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      if (uploadPrivacy === 'public') {
        // Refetch images to get the new ones
        const res = await fetch(`${API_URL}/public-photos`);
        const imgs = await res.json();
        // Directly add new images to collage without animation
        if (imgs.length > 0) {
          const newImgs = imgs.slice(-files.length);
          const baseIdx = images.length;
          const newPositions = newImgs.map((img, i) => {
            const idx = baseIdx + i;
            return getRandomPosition(idx, baseIdx + newImgs.length);
          });
          
          // Add new images and positions directly to state
          setImages(prev => [...prev, ...newImgs]);
          setPositions(prev => [...prev, ...newPositions]);
        }
      }
      alert('Upload successful!');
    } catch (err) {
      alert('Upload failed.');
    }
    e.target.value = '';
  };





  // Upload Modal
  function UploadModal({ open, onClose, onConfirm, uploading }) {
    const [privacy, setPrivacy] = useState('public');
    const handleConfirm = () => {
      onConfirm(privacy);
      setPrivacy('public');
    };
    if (!open) return null;
    return (
      <div className="upload-modal-overlay">
        <div className="upload-modal">
          <h3>Upload Photos</h3>
          <div className="privacy-options">
            <label>
              <input
                type="radio"
                name="privacy"
                value="public"
                checked={privacy === 'public'}
                onChange={() => setPrivacy('public')}
                disabled={uploading}
              />
              Public
            </label>
            <label>
              <input
                type="radio"
                name="privacy"
                value="private"
                checked={privacy === 'private'}
                onChange={() => setPrivacy('private')}
                disabled={uploading}
              />
              Private
            </label>
          </div>
          <div className="upload-modal-actions">
            <button onClick={onClose} disabled={uploading}>Cancel</button>
            <button onClick={handleConfirm} disabled={uploading}>
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="collage-abs-bg">
      <CollageFlowerCanvas />
      {/* Upload Photos Button */}
      <button
        className="collage-upload-btn"
        ref={uploadBtnRef}
        onClick={() => setShowUploadModal(true)}
      >
        Upload Photos
      </button>
      <UploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onConfirm={privacy => {
          setUploadPrivacy(privacy);
          setShowUploadModal(false);
          if (fileInputRef.current) fileInputRef.current.click();
        }}
        uploading={false}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />

      {/* Featured photo pop-up overlay */}
      {showFeatured && featured && (
        <div className="collage-featured-overlay">
          <img
            src={`${process.env.REACT_APP_API_URL}/uploads/${featured.original}`}
            alt="Featured"
            className="collage-featured-img"
            onError={() => setShowFeatured(false)}
          />
        </div>
      )}
      {/* Reserved area for Groom/Bride details */}
      <div className="collage-reserved">
        {brideGroom && brideGroom.bride && brideGroom.groom ? (
          <div className="bride-groom-center">
            <div className="bride-groom-imgs">
              <div className="bride-groom-img-block">
                <img src={`${process.env.REACT_APP_API_URL}/uploads/bride-groom/${brideGroom.bride.photo}`} alt={brideGroom.bride.name} className="bride-groom-img" />
                <div className="bride-groom-name">{brideGroom.bride.name}</div>
                <div className="bride-groom-caption">{brideGroom.bride.caption}</div>
              </div>
              <div className="bride-groom-img-block">
                <img src={`${process.env.REACT_APP_API_URL}/uploads/bride-groom/${brideGroom.groom.photo}`} alt={brideGroom.groom.name} className="bride-groom-img" />
                <div className="bride-groom-name">{brideGroom.groom.name}</div>
                <div className="bride-groom-caption">{brideGroom.groom.caption}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bride-groom-placeholder">Bride & Groom details coming soon!</div>
        )}
      </div>
      {images.map((img, idx) => {
        // Use precomputed position if available
        const pos = positions[idx];
        return (
          <img
            key={img.thumbnail + idx}
            src={hovered[img.thumbnail + idx] ? `${process.env.REACT_APP_API_URL}/uploads/${img.original}` : `${process.env.REACT_APP_API_URL}/uploads/${img.thumbnail}`}
            alt=""
            className="collage-abs-thumb"
            style={{
              display: loaded[img.thumbnail + idx] ? 'block' : 'none',
              left: `calc(${pos?.x * 100}% - 60px)` ,
              top: `calc(${pos?.y * 100}% - 45px)` ,
              transform: `rotate(${pos?.rot}deg) scale(${pos?.scale})`,
              zIndex: pos?.z,
              animationDelay: `${pos?.delay || 0}s`,
            }}
            onMouseEnter={() => setHovered(prev => ({ ...prev, [img.thumbnail + idx]: true }))}
            onMouseLeave={() => setHovered(prev => ({ ...prev, [img.thumbnail + idx]: false }))}
            onLoad={() =>
              setLoaded(prev => ({ ...prev, [img.thumbnail + idx]: true }))
            }
            onError={() =>
              setLoaded(prev => ({ ...prev, [img.thumbnail + idx]: false }))
            }
          />
        );
      })}
    </div>
  );
} 