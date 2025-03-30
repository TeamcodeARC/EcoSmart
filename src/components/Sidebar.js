import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider, IconButton } from '@mui/material';
import { 
  ChevronLeft, 
  WaterDrop, 
  BoltOutlined
} from '@mui/icons-material';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [timeRange, setTimeRange] = useState([0, 24]);
  
  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const iconVariants = {
    hover: { rotate: 15, scale: 1.1 }
  };

  return (
    <motion.div 
      className="sidebar"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
    >
      <div className="sidebar-header">
        <h3>Filters</h3>
        <IconButton onClick={toggleSidebar}>
          <ChevronLeft />
        </IconButton>
      </div>

      <div className="sidebar-content">
        <div className="filter-section">
          <h4>Sensor Types</h4>
          <div className="sensor-icons">
            <motion.div
              whileHover="hover"
              variants={iconVariants}
            >
              <IconButton className="sensor-icon water">
                <WaterDrop />
              </IconButton>
            </motion.div>
            <motion.div
              whileHover="hover"
              variants={iconVariants}
            >
              <IconButton className="sensor-icon energy">
                <BoltOutlined />
              </IconButton>
            </motion.div>
          </div>
        </div>

        <div className="filter-section">
          <h4>Time Range</h4>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="time-slider"
          >
            <Slider
              value={timeRange}
              onChange={(e, newValue) => setTimeRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={24}
              marks
              valueLabelFormat={value => `${value}:00`}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
