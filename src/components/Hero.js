import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css';
import { WaterRipple } from './WaterRipple';
import { useMediaQuery } from '@mui/material';
import { buttonHoverEffect, buttonTapEffect, contentFadeIn } from '../utils/animations';

const getAnimationDuration = (isDesktop, isTablet) => {
  if (isDesktop) return 1;
  if (isTablet) return 0.8;
  return 0.6;
};

export const Hero = () => {
  const isDesktop = useMediaQuery('(min-width:1025px)');
  const isTablet = useMediaQuery('(min-width:769px) and (max-width:1024px)');
  
  const duration = getAnimationDuration(isDesktop, isTablet);
  
  const responsiveTitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        ease: "easeOut"
      }
    }
  };

  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/dashboard');
  };

  return (
    <div className="hero">
      <WaterRipple />
      <motion.div
        className="hero-content"
        initial="initial"
        animate="animate"
        variants={contentFadeIn}
        layoutId="hero-content"
      >
        <motion.h1 
          className="hero-title"
          variants={responsiveTitleVariants}
          initial="hidden"
          animate="visible"
        >
          Smart Resource Management
          <span className="highlight">Predict • Alert • Optimize</span>
        </motion.h1>
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Transform your resource management with AI-powered insights and intelligent analytics
        </motion.p>
        <motion.button
          className="hero-cta interactive-element"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
          }}
          whileHover={buttonHoverEffect}
          whileTap={buttonTapEffect}
          onClick={handleExplore}
        >
          Explore Solutions
        </motion.button>
      </motion.div>
    </div>
  );
};
