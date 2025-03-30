import React, { useEffect, useRef, useMemo } from 'react';
import { useMediaQuery } from '@mui/material';
import '../styles/WaterRipple.css';

export const WaterRipple = () => {
  const isDesktop = useMediaQuery('(min-width:1025px)');
  const isTablet = useMediaQuery('(min-width:769px) and (max-width:1024px)');
  
  const rippleConfig = useMemo(() => ({
    frequency: isDesktop ? 1 : isTablet ? 0.8 : 0.6,
    density: isDesktop ? 1 : isTablet ? 0.7 : 0.5,
    opacity: isDesktop ? 0.1 : 0.08,
  }), [isDesktop, isTablet]);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawRipple = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = `rgba(255, 255, 255, ${rippleConfig.opacity})`;
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < canvas.width; i += 30 * rippleConfig.density) {
        for (let j = 0; j < canvas.height; j += 30 * rippleConfig.density) {
          const distortion = Math.sin(i * 0.01 * rippleConfig.frequency + time) * Math.cos(j * 0.01 * rippleConfig.frequency + time) * 2;
          
          ctx.beginPath();
          ctx.moveTo(i + distortion, j);
          ctx.lineTo(i + distortion + 30 * rippleConfig.density, j);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(i, j + distortion);
          ctx.lineTo(i, j + distortion + 30 * rippleConfig.density);
          ctx.stroke();
        }
      }
      
      time += 0.01;
      animationFrameId = requestAnimationFrame(drawRipple);
    };

    window.addEventListener('resize', resize);
    resize();
    drawRipple();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [rippleConfig]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};
