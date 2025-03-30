import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import { BoltOutlined, WaterDrop, Insights, Analytics } from '@mui/icons-material';

const iconStyles = {
  fontSize: '2.5rem',
  opacity: 0.2,
  color: '#2a9d8f',
};

const getRandomPosition = () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 0.5 + 0.5, // Size between 0.5 and 1
  rotation: Math.random() * 360,
  delay: Math.random() * 5,
  duration: Math.random() * 10 + 20,
});

export const FloatingIcons = () => {
  // Generate random positions for the icons
  const icons = [
    { icon: <BoltOutlined sx={iconStyles} />, ...getRandomPosition() },
    { icon: <WaterDrop sx={iconStyles} />, ...getRandomPosition() },
    { icon: <Insights sx={iconStyles} />, ...getRandomPosition() },
    { icon: <Analytics sx={iconStyles} />, ...getRandomPosition() },
    { icon: <BoltOutlined sx={iconStyles} />, ...getRandomPosition() },
    { icon: <WaterDrop sx={iconStyles} />, ...getRandomPosition() },
    { icon: <Insights sx={iconStyles} />, ...getRandomPosition() },
    { icon: <Analytics sx={iconStyles} />, ...getRandomPosition() },
  ];

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {icons.map((item, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `scale(${item.size}) rotate(${item.rotation}deg)`,
          }}
          animate={{
            y: ['0%', '100%'],
            rotate: [item.rotation, item.rotation + 360],
          }}
          transition={{
            y: {
              duration: item.duration,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
              delay: item.delay,
            },
            rotate: {
              duration: item.duration * 2,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
              delay: item.delay,
            },
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </Box>
  );
};

export default FloatingIcons;