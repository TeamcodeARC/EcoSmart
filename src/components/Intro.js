import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Intro.css';

export const Intro = () => {
  return (
    <section className="intro">
      <div className="intro-content">
        <motion.div
          className="intro-text"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Transform Your Resource Management</h2>
          <p>Our AI-powered platform helps organizations optimize their energy and water consumption through real-time monitoring, predictive analytics, and automated controls.</p>
        </motion.div>
        
        <motion.div
          className="intro-image"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <img 
            src="/assets/dashboard-preview.png" 
            alt="Dashboard Preview"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x300?text=Dashboard+Preview';
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};
