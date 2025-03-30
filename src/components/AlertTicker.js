import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AlertTicker = () => {
  const [alerts] = useState([
    "[Zone A] Water usage spike detected",
    "[Zone B] Energy consumption below average",
    "[Zone A] Maintenance scheduled for tomorrow",
    "[Zone B] Peak usage hours approaching"
  ]);
  
  const [currentAlert, setCurrentAlert] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % alerts.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [alerts.length]);

  return (
    <div className="alert-ticker">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAlert}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="alert-message"
        >
          {alerts[currentAlert]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
