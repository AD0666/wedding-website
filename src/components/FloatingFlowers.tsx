import React, { useEffect, useRef } from 'react';

interface Flower {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
  type: 'rose' | 'daisy' | 'tulip' | 'lily';
  color: string;
}

const FloatingFlowers: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flowersRef = useRef<Flower[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Flower colors and types
    const flowerTypes = [
      { type: 'rose', color: '#ff69b4', size: 15 }, // Hot pink rose
      { type: 'rose', color: '#ff1493', size: 16 }, // Deep pink rose
      { type: 'rose', color: '#dc143c', size: 14 }, // Crimson rose
      { type: 'daisy', color: '#fffacd', size: 12 }, // Light yellow daisy
      { type: 'daisy', color: '#f0e68c', size: 13 }, // Khaki daisy
      { type: 'daisy', color: '#ffd700', size: 11 }, // Gold daisy
      { type: 'tulip', color: '#9370db', size: 14 }, // Medium purple tulip
      { type: 'tulip', color: '#8a2be2', size: 15 }, // Blue violet tulip
      { type: 'tulip', color: '#9932cc', size: 13 }, // Dark orchid tulip
      { type: 'lily', color: '#ff6347', size: 13 }, // Tomato lily
      { type: 'lily', color: '#ff4500', size: 14 }, // Orange red lily
      { type: 'lily', color: '#ff8c00', size: 12 }  // Dark orange lily
    ];

    // Initialize flowers
    const initFlowers = () => {
      flowersRef.current = [];
      const rightSideWidth = canvas.width * 0.5; // Right half of screen
      const startX = canvas.width * 0.5; // Start from middle

      for (let i = 0; i < 25; i++) {
        const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
        flowersRef.current.push({
          id: i,
          x: startX + Math.random() * rightSideWidth,
          y: -50 - Math.random() * 200, // Start above screen
          size: flowerType.size + Math.random() * 8,
          rotation: Math.random() * 360,
          delay: Math.random() * 3000,
          type: flowerType.type,
          color: flowerType.color
        });
      }
    };

    // Draw flower functions
    const drawRose = (x: number, y: number, size: number, rotation: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);

             // Rose petals
       for (let i = 0; i < 8; i++) {
         ctx.save();
         ctx.rotate((i * Math.PI) / 4);
         
         // Petal gradient
         const gradient = ctx.createRadialGradient(0, -size/2, 0, 0, -size/2, size);
         gradient.addColorStop(0, color);
         gradient.addColorStop(1, '#8b0000');
         
         ctx.fillStyle = gradient;
         ctx.beginPath();
         ctx.ellipse(0, -size/2, size/3, size/2, 0, 0, Math.PI * 2);
         ctx.fill();
         ctx.restore();
       }

       // Center
       ctx.fillStyle = '#654321';
      ctx.beginPath();
      ctx.arc(0, 0, size/4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawDaisy = (x: number, y: number, size: number, rotation: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);

      // Petals
      for (let i = 0; i < 12; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 6);
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(0, -size/2, size/4, size/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Center
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(0, 0, size/3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawTulip = (x: number, y: number, size: number, rotation: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);

      // Tulip petals
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -size/2);
      ctx.quadraticCurveTo(size/3, -size/2, size/3, 0);
      ctx.quadraticCurveTo(size/3, size/3, 0, size/2);
      ctx.quadraticCurveTo(-size/3, size/3, -size/3, 0);
      ctx.quadraticCurveTo(-size/3, -size/2, 0, -size/2);
      ctx.fill();

      // Stem
      ctx.strokeStyle = '#4caf50';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, size/2);
      ctx.lineTo(0, size);
      ctx.stroke();

      ctx.restore();
    };

    const drawLily = (x: number, y: number, size: number, rotation: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);

      // Lily petals
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 3);
        
        const gradient = ctx.createLinearGradient(0, -size/2, 0, size/2);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, '#ff4500');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, -size/2, size/3, size/1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Center
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(0, 0, size/4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Draw flower based on type
    const drawFlower = (flower: Flower) => {
      switch (flower.type) {
        case 'rose':
          drawRose(flower.x, flower.y, flower.size, flower.rotation, flower.color);
          break;
        case 'daisy':
          drawDaisy(flower.x, flower.y, flower.size, flower.rotation, flower.color);
          break;
        case 'tulip':
          drawTulip(flower.x, flower.y, flower.size, flower.rotation, flower.color);
          break;
        case 'lily':
          drawLily(flower.x, flower.y, flower.size, flower.rotation, flower.color);
          break;
      }
    };

    // Animation loop
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      flowersRef.current.forEach((flower, index) => {
        // Start animation after delay
        if (timestamp < flower.delay) {
          drawFlower(flower);
          return;
        }

        const elapsed = timestamp - flower.delay;
        const duration = 8000; // 8 seconds to fall
        const progress = (elapsed % duration) / duration;

        // Update position
        flower.y = -50 + (canvas.height + 100) * progress;
        flower.x += Math.sin(elapsed * 0.001 + flower.id) * 0.5; // Gentle swaying
        flower.rotation += 0.5; // Slow rotation

        // Reset flower when it goes off screen
        if (flower.y > canvas.height + 50) {
          flower.y = -50 - Math.random() * 100;
          flower.x = canvas.width * 0.5 + Math.random() * (canvas.width * 0.5);
          flower.delay = timestamp + Math.random() * 2000;
        }

        // Add some transparency for depth
        ctx.globalAlpha = 0.7 + Math.sin(elapsed * 0.002 + flower.id) * 0.3;
        drawFlower(flower);
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    initFlowers();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="floating-flowers-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};

export default FloatingFlowers; 