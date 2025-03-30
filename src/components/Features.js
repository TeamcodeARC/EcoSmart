import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Features.css';
import {
  MonitorRounded,
  BarChartRounded,
  PsychologyRounded,
  SmartToyRounded,
  AttachMoneyRounded,
  TrendingUpRounded
} from '@mui/icons-material';

export const Features = () => {
  const features = [
    {
      title: 'Real-time Monitoring',
      description: 'Track resource usage in real-time with advanced analytics and instant insights',
      icon: <MonitorRounded />,
      secondaryIcon: <BarChartRounded />
    },
    {
      title: 'AI Predictions',
      description: 'Smart forecasting and predictive analytics for optimal resource allocation',
      icon: <PsychologyRounded />,
      secondaryIcon: <SmartToyRounded />
    },
    {
      title: 'Cost Savings',
      description: 'Reduce waste and improve efficiency with intelligent optimization algorithms',
      icon: <AttachMoneyRounded />,
      secondaryIcon: <TrendingUpRounded />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="features">
      <motion.div
        className="features-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Our Features</h1>
        <p>Discover how our AI-powered platform can transform your resource management</p>
      </motion.div>
      
      <motion.div
        className="features-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {features.map((feature, index) => (
          <motion.div
            className="feature-card"
            key={index}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <motion.div 
              className="feature-icon-group"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="feature-icon primary">
                {React.cloneElement(feature.icon, {
                  sx: { 
                    fontSize: '2.5rem',
                    color: '#34D399',
                    filter: 'drop-shadow(0 2px 4px rgba(52, 211, 153, 0.2))'
                  }
                })}
              </div>
              <div className="feature-icon secondary">
                {React.cloneElement(feature.secondaryIcon, {
                  sx: { 
                    fontSize: '1.8rem',
                    color: '#2DD4BF',
                    opacity: 0.7
                  }
                })}
              </div>
            </motion.div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
