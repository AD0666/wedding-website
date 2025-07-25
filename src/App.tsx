import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
            {uploading ? 'Uploading...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CometHero() {
  return (
    <div className="hero-comet-card">
      <video
        className="comet-video-bg"
        src={process.env.PUBLIC_URL + '/weddingheroaction.mp4'}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, borderRadius: 'inherit', zIndex: 1 }}
      />
      {/* Couple removed as requested */}
    </div>
  );
}

function FloatingNav({ triggerFileInput, uploading }) {
  return (
    <nav className="floating-nav">
      <a href="#hero" className="nav-btn">Home</a>
      <a href="#our-story" className="nav-btn">Our Story</a>
      <a href="#event-details" className="nav-btn">Event Details</a>
      <button className="nav-btn upload-nav-btn" type="button" onClick={triggerFileInput} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Photos'}
      </button>
      <a href="#rsvp" className="nav-btn">RSVP</a>
      <a href="#gallery" className="nav-btn">Gallery</a>
      <a href="#registry" className="nav-btn">Registry</a>
    </nav>
  );
}

function FloatingActionButton() {
  return (
    <a href="#rsvp" className="fab-rsvp" title="RSVP">
      RSVP
    </a>
  );
}

// --- Collage Floating Button ---
function FloatingCollageButton() {
  return (
    <a
      href="/collage"
      className="fab-collage"
      title="Collage"
      target="_blank"
      rel="noopener noreferrer"
    >
      Collage
    </a>
  );
}
// --- End Collage Floating Button ---

// --- Floating Fog/Smoke Canvas Overlay ---
function FloatingFogCanvas() {
  const canvasRef = useRef(null);
  const parentRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = parent.offsetWidth;
    let height = parent.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // More realistic fog: multiple layers, radial gradients, organic wobble
    const LAYERS = 3;
    const BLOBS_PER_LAYER = [4, 5, 6];
    const fogLayers = Array.from({ length: LAYERS }, (_, layerIdx) =>
      Array.from({ length: BLOBS_PER_LAYER[layerIdx] }, () => {
        const baseR = 120 + Math.random() * 120 * (1 + layerIdx * 0.2);
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: baseR,
          baseR,
          dx: (Math.random() - 0.5) * (0.08 + 0.04 * layerIdx),
          dy: (Math.random() - 0.5) * (0.06 + 0.03 * layerIdx),
          baseAlpha: 0.10 + Math.random() * 0.10 + layerIdx * 0.04,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 0.7 + layerIdx * 0.2,
          wobbleMag: 18 + Math.random() * 18 + layerIdx * 6,
          wobbleSpeed: 0.5 + Math.random() * 0.5 + layerIdx * 0.2,
        };
      })
    );

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      const now = Date.now() / 1000;
      for (let layerIdx = 0; layerIdx < LAYERS; ++layerIdx) {
        for (const f of fogLayers[layerIdx]) {
          // Organic wobble
          const wobbleX = Math.sin(now * f.wobbleSpeed + f.phase) * f.wobbleMag;
          const wobbleY = Math.cos(now * f.wobbleSpeed * 0.7 + f.phase) * f.wobbleMag * 0.7;
          // Animate opacity with a slow sine wave
          const alpha = f.baseAlpha + Math.sin(now * 0.3 + f.phase) * 0.05;
          // Animate radius for breathing effect
          const r = f.baseR * (0.95 + 0.08 * Math.sin(now * 0.4 + f.phase));
          // Draw radial gradient
          const grad = ctx.createRadialGradient(
            f.x + wobbleX,
            f.y + wobbleY,
            r * 0.1,
            f.x + wobbleX,
            f.y + wobbleY,
            r
          );
          grad.addColorStop(0, `rgba(220,220,255,${alpha * 1.2})`);
          grad.addColorStop(0.25, `rgba(220,220,255,${alpha})`);
          grad.addColorStop(0.7, `rgba(220,220,255,${alpha * 0.18})`);
          grad.addColorStop(1, 'rgba(220,220,255,0)');
          ctx.save();
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(f.x + wobbleX, f.y + wobbleY, r, 0, 2 * Math.PI);
          ctx.fillStyle = grad;
          ctx.filter = 'blur(18px)';
          ctx.fill();
          ctx.restore();
          // Move
          f.x += f.dx * f.speed;
          f.y += f.dy * f.speed;
          // Wrap around section
          if (f.x < -f.baseR) f.x = width + f.baseR;
          if (f.x > width + f.baseR) f.x = -f.baseR;
          if (f.y < -f.baseR) f.y = height + f.baseR;
          if (f.y > height + f.baseR) f.y = -f.baseR;
        }
      }
      ctx.globalCompositeOperation = 'source-over';
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();
    // Handle resize
    const handleResize = () => {
      width = parent.offsetWidth;
      height = parent.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  // The parentRef is attached to a wrapper div that fills the hero section
  return (
    <div ref={parentRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
    </div>
  );
}
// --- End Floating Fog/Smoke Canvas Overlay ---

// --- Wedding Sparkle Canvas Overlay (Easily Removable) ---
function WeddingSparkleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    // Sparkle config
    const sparkles = Array.from({ length: 500 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.5 + Math.random() * 2.5,
      dx: (Math.random() - 0.5) * 0.2,
      dy: 0.2 + Math.random() * 0.5,
      opacity: 0.5 + Math.random() * 0.5,
      color: [
        'rgba(255,192,203,', // pink
        'rgba(230,230,250,', // lavender
        'rgba(255,255,224,', // light gold
        'rgba(255,182,193,', // blush
      ][Math.floor(Math.random() * 4)]
    }));
    // Petal config
    const petals = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      w: 16 + Math.random() * 10,
      h: 8 + Math.random() * 6,
      dx: Math.sin(Math.random() * Math.PI * 2) * 0.3,
      dy: 0.5 + Math.random() * 0.7,
      angle: Math.random() * Math.PI * 2,
      dAngle: (Math.random() - 0.5) * 0.02,
      sway: 0.5 + Math.random() * 0.8,
      color: [
        'rgba(255,182,193,0.7)', // blush
        'rgba(230,230,250,0.7)', // lavender
        'rgba(255,192,203,0.7)', // pink
      ][Math.floor(Math.random() * 3)]
    }));
    function draw() {
      ctx.clearRect(0, 0, width, height);
      // Draw sparkles
      for (const s of sparkles) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
        ctx.fillStyle = s.color + s.opacity + ')';
        ctx.shadowColor = s.color + '1)';
        ctx.shadowBlur = 8;
        ctx.fill();
        s.x += s.dx;
        s.y += s.dy;
        if (s.y > height + 10) {
          s.y = -10;
          s.x = Math.random() * width;
        }
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
      }
      // Draw petals
      for (const p of petals) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.w, p.h, 0, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.shadowColor = 'rgba(255,182,193,0.3)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
        // Animate
        p.x += Math.sin(p.angle) * p.sway + p.dx;
        p.y += p.dy;
        p.angle += p.dAngle;
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
          p.angle = Math.random() * Math.PI * 2;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
      }
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);
  return <canvas ref={canvasRef} className="wedding-sparkle-canvas" />;
}
// --- End Wedding Sparkle Canvas Overlay ---

// --- Lily SVG Component ---
function Lily({ x, y, angle, distance }) {
  const [fly, setFly] = useState(false);
  const [startTime] = useState(Date.now());
  useEffect(() => {
    setTimeout(() => setFly(true), 10);
  }, []);
  // Sine wave for elegant flight
  const now = Date.now();
  const elapsed = Math.min((now - startTime) / 3000, 1); // 0 to 1 over 3s
  const rad = (angle * Math.PI) / 180;
  const baseTx = Math.cos(rad) * distance;
  const baseTy = Math.sin(rad) * distance;
  // Sine wave offset (gentle up/down bob)
  const sineOffset = Math.sin(elapsed * Math.PI * 2) * 16 * (1 - elapsed); // amplitude tapers off
  // Calculate transform for current frame
  const tx = fly ? baseTx : 0;
  const ty = fly ? baseTy + sineOffset : 0;
  return (
    <svg
      width="44" height="44" viewBox="0 0 64 64"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 9999,
        filter: 'drop-shadow(0 2px 8px #b0c4de88)',
        transform: `translate(${tx - 32}px, ${ty - 32}px) rotate(${angle}deg) scale(${fly ? 1.2 : 1})`,
        transition: fly ? 'transform 3s cubic-bezier(0.4,0.2,0.2,1), opacity 3s' : undefined,
        opacity: fly ? 0 : 1,
        willChange: 'transform, opacity',
      }}
    >
      {/* White Lily Flower SVG */}
      <g>
        {/* Petals */}
        <ellipse cx="32" cy="32" rx="10" ry="22" fill="#fff" stroke="#e0e0e0" strokeWidth="1.5"/>
        <ellipse cx="32" cy="32" rx="22" ry="10" fill="#fff" stroke="#e0e0e0" strokeWidth="1.5"/>
        <ellipse cx="32" cy="18" rx="6" ry="14" fill="#fff" stroke="#e0e0e0" strokeWidth="1.2"/>
        <ellipse cx="32" cy="46" rx="6" ry="14" fill="#fff" stroke="#e0e0e0" strokeWidth="1.2"/>
        <ellipse cx="18" cy="32" rx="14" ry="6" fill="#fff" stroke="#e0e0e0" strokeWidth="1.2"/>
        <ellipse cx="46" cy="32" rx="14" ry="6" fill="#fff" stroke="#e0e0e0" strokeWidth="1.2"/>
        {/* Center */}
        <circle cx="32" cy="32" r="5" fill="#fffbe7" stroke="#f9d423" strokeWidth="1.5"/>
        {/* Stamen */}
        <ellipse cx="32" cy="28" rx="1.2" ry="3.5" fill="#f9d423"/>
        <ellipse cx="32" cy="36" rx="1.2" ry="3.5" fill="#f9d423"/>
        <ellipse cx="28" cy="32" rx="3.5" ry="1.2" fill="#f9d423"/>
        <ellipse cx="36" cy="32" rx="3.5" ry="1.2" fill="#f9d423"/>
      </g>
    </svg>
  );
}
// --- End Lily SVG Component ---

function HeartTrail() {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      className="journey-heart-trail-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      one journey
      {hovered && (
        <span className="journey-heart-trail">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="journey-heart"
              style={{
                left: `${i * 12}px`,
                animationDelay: `${i * 0.08}s`,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 17s-6-4.35-6-8.5A3.5 3.5 0 0 1 10 5a3.5 3.5 0 0 1 6 3.5C16 12.65 10 17 10 17z" fill="#fff" stroke="#e0c3fc" strokeWidth="1.2"/>
              </svg>
            </span>
          ))}
        </span>
      )}
    </span>
  );
}

function App() {
  const parallaxRef = useRef(null); // Remove <HTMLSpanElement>
  const fileInputRef = useRef(); // Remove <HTMLInputElement>
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPrivacy, setUploadPrivacy] = useState('public');
  const [galleryImages, setGalleryImages] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [lightboxImage, setLightboxImage] = useState(null);

  // --- Heart Trail State ---
  const [hearts, setHearts] = useState([]);
  const lastHeartTimeRef = useRef(0);

  // --- Lily State ---
  const [lilies, setLilies] = useState([]);

  // Fetch public images
  const fetchGalleryImages = async () => {
    try {
      const res = await fetch('/public-photos');
      const data = await res.json();
      console.log('Fetched galleryImages:', data); // DEBUG
      setGalleryImages(data);
    } catch (err) {
      setGalleryImages([]);
      console.error('Failed to fetch gallery images:', err); // DEBUG
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });

    // Parallax effect for hero text
    const handleMouseMove = (e) => {
      if (parallaxRef.current) {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 30;
        const y = (e.clientY / innerHeight - 0.5) * 30;
        parallaxRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  // --- Heart Trail Animation ---
  useEffect(() => {
    if (hearts.length === 0) return;
    const timeout = setTimeout(() => {
      setHearts((prev) => prev.slice(1));
    }, 600 / hearts.length); // Stagger fade out
    return () => clearTimeout(timeout);
  }, [hearts]);

  // --- Lily Click Handler ---
  useEffect(() => {
    const handleClick = (e) => {
      if (e.button !== 0) return; // Only left click
      const lilyCount = 8; // Always 8 lilies
      const newLilies = Array.from({ length: lilyCount }, (_, i) => {
        const baseAngle = i * (360 / lilyCount); // Spread evenly in all directions
        const angle = baseAngle + (Math.random() - 0.5) * 10;
        const distance = 180 + Math.random() * 80; // 180–260px for longer flight
        return {
          id: Math.random().toString(36).substr(2, 9) + Date.now(),
          x: e.clientX,
          y: e.clientY,
          angle,
          distance,
        };
      });
      setLilies((prev) => [...prev, ...newLilies]);
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);
  // Remove lilies after animation
  useEffect(() => {
    if (lilies.length === 0) return;
    const timeout = setTimeout(() => {
      setLilies((prev) => prev.slice(lilies.length));
    }, 3000); // 3 seconds
    return () => clearTimeout(timeout);
  }, [lilies]);

  // Trigger file input
  const triggerFileInput = () => {
    setShowUploadModal(true);
  };

  const handleModalConfirm = (privacy) => {
    setUploadPrivacy(privacy);
    setShowUploadModal(false);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Handle file upload
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }
    const endpoint = uploadPrivacy === 'private' ? '/upload/private' : '/upload/public';
    try {
      await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      alert('Upload successful!');
      fetchGalleryImages(); // Refresh gallery after upload
    } catch (err) {
      alert('Upload failed.');
    }
    setUploading(false);
    e.target.value = '';
  };

  // --- Heart Trail Mouse Handler ---
  const handleParallaxMouseMove = (e) => {
    const now = Date.now();
    if (now - lastHeartTimeRef.current < 60) return; // Only add every 60ms
    lastHeartTimeRef.current = now;
    const rect = parallaxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHearts((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        x,
        y,
        created: Date.now(),
        emoji: Math.random() < 0.7 ? '💖' : (Math.random() < 0.5 ? '💍' : '✨')
      }
    ]);
  };

  return (
    <div className="App">
      {/* --- Floating Fog/Smoke Canvas Overlay --- */}
      {/* FloatingFogCanvas is now rendered inside the hero section */}
      {/* --- Wedding Sparkle Canvas Overlay (Easily Removable) --- */}
      <WeddingSparkleCanvas />
      {/* --- End Wedding Sparkle Canvas Overlay --- */}
      {/* Lightbox modal for full image */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={lightboxImage} alt="Full" className="lightbox-img" />
            <button className="lightbox-close" onClick={() => setLightboxImage(null)}>&times;</button>
          </div>
        </div>
      )}
      <UploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onConfirm={handleModalConfirm}
        uploading={uploading}
      />
      <FloatingNav triggerFileInput={triggerFileInput} uploading={uploading} />
      <FloatingActionButton />
      <FloatingCollageButton />
      <CometHero />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      <section className="hero" id="hero" data-aos="fade-up" style={{ position: 'relative', overflow: 'hidden' }}>
        <FloatingFogCanvas />
        <h1 style={{ position: 'relative', display: 'inline-block' }}>
          <span
            className="parallax"
            ref={parallaxRef}
            onMouseMove={handleParallaxMouseMove}
            style={{ position: 'relative', zIndex: 2, cursor: 'pointer' }}
          >
            Alex & Jamie
            {/* --- Heart Trail Overlay --- */}
            {hearts.map((h) => (
              <span
                key={h.id}
                style={{
                  position: 'absolute',
                  left: h.x,
                  top: h.y,
                  pointerEvents: 'none',
                  fontSize: '1.5rem',
                  opacity: 1 - (Date.now() - h.created) / 700,
                  transform: `translate(-50%, -50%) scale(${1 + Math.random() * 0.3})`,
                  transition: 'opacity 0.4s, transform 0.4s',
                  zIndex: 3
                }}
              >
                {h.emoji}
              </span>
            ))}
            {/* --- End Heart Trail Overlay --- */}
          </span>
        </h1>
        <p className="date">September 21, 2024</p>
        <p className="tagline">
          <span className="heartbeat-text">Two hearts</span>, <HeartTrail />.
        </p>
      </section>
      <main className="main-content">
        <div className="animated-divider" />
        <section className="frosted-card" id="our-story" data-aos="fade-up" data-aos-delay="200">
          <h2>Our Story</h2>
          <p>From a chance meeting to a lifetime together, our story is filled with laughter, adventure, and love. We can’t wait to celebrate the next chapter with you.</p>
        </section>
        <div className="animated-divider" />
        <section className="frosted-card" id="event-details" data-aos="fade-up" data-aos-delay="400">
          <h2>Event Details</h2>
          <ul>
            <li><strong>Reception:</strong> 5:00 PM, Hotel Atithi</li>
            <li><strong>Address:</strong> AK Azad Rd, Opp. Nepali Mandir, Guwahati, Assam 781008</li>
          </ul>
          <a
            className="map-link"
            href="https://maps.app.goo.gl/rCzZYccDTmqCYhNv7"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Map
          </a>
        </section>
        <div className="animated-divider" />
        <section className="frosted-card" id="rsvp" data-aos="fade-up" data-aos-delay="600">
          <h2>RSVP</h2>
          <form className="rsvp-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <select required>
              <option value="">Will you attend?</option>
              <option value="yes">Yes, I'll be there!</option>
              <option value="no">Sorry, can't make it</option>
            </select>
            <button type="submit">Send RSVP</button>
          </form>
        </section>
        <div className="animated-divider" />
        <section className="frosted-card" id="gallery" data-aos="fade-up" data-aos-delay="800">
          <h2>Gallery</h2>
          <div className="gallery-row-scroll">
            {galleryImages.length === 0 && (
              <div style={{ color: '#a7a6f6', fontWeight: 600, fontSize: '1.1rem' }}>No public photos yet.</div>
            )}
            {galleryImages.slice().reverse().map((img, idx) => {
              const thumbUrl = `/uploads/${img.thumbnail}`;
              // Only render if not explicitly failed
              if (loadedImages[img.thumbnail] === false) return null;
              return (
                <div className="gallery-row-item" key={img.thumbnail + idx}>
                  <img
                    src={thumbUrl}
                    alt=""
                    className="gallery-img"
                    loading="lazy"
                    onLoad={() => {
                      setLoadedImages(prev => ({ ...prev, [img.thumbnail]: true }));
                      console.log('Loaded thumbnail:', thumbUrl); // DEBUG
                    }}
                    onError={() => {
                      setLoadedImages(prev => ({ ...prev, [img.thumbnail]: false }));
                      console.error('Failed to load thumbnail:', thumbUrl); // DEBUG
                    }}
                    onClick={() => setLightboxImage(`/uploads/${img.original}`)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              );
            })}
          </div>
          <button className="upload-btn" type="button" onClick={triggerFileInput} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Your Photos'}
          </button>
        </section>
        <div className="animated-divider" />
        <section className="frosted-card" id="registry" data-aos="fade-up" data-aos-delay="1000">
          <h2>Registry</h2>
          <p>Your presence is the best gift, but if you wish to bless us further, here’s our <a href="#">wedding registry</a>.</p>
        </section>
      </main>
      <footer className="footer" data-aos="fade-up" data-aos-delay="1200">
        <p>With love, Alex & Jamie</p>
        <p>Contact: <a href="mailto:shillongpixels@gmail.com">shillongpixels@gmail.com</a></p>
      </footer>
      {/* --- Lily SVGs Overlay (Easily Removable) --- */}
      {lilies.map(lily => {
        const { id, ...lilyProps } = lily;
        return <Lily key={id} {...lilyProps} />;
      })}
      {/* --- End Lily SVGs Overlay --- */}
    </div>
  );
}

export default App;
