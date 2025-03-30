import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Opacity, BoltOutlined, FilterList } from '@mui/icons-material';
import { IconButton, FormControl, Select, MenuItem } from '@mui/material';
import { Sidebar } from './Sidebar';
import { AlertTicker } from './AlertTicker';
import '../styles/Dashboard.css';
import { FloatingIcons } from './FloatingIcons';

export const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState('zoneA');

  const zoneData = {
    zoneA: {
      energy: [
        { name: 'Mon', value: 2.4 },
        { name: 'Tue', value: 2.1 },
        { name: 'Wed', value: 2.8 },
        { name: 'Thu', value: 1.9 },
        { name: 'Fri', value: 2.3 },
        { name: 'Sat', value: 1.8 },
        { name: 'Sun', value: 2.0 },
      ],
      water: [
        { name: 'Mon', value: 150 },
        { name: 'Tue', value: 145 },
        { name: 'Wed', value: 160 },
        { name: 'Thu', value: 130 },
        { name: 'Fri', value: 140 },
        { name: 'Sat', value: 120 },
        { name: 'Sun', value: 135 },
      ],
      currentEnergy: { value: 2.4, trend: -12 },
      currentWater: { value: 150, trend: 8 }
    },
    zoneB: {
      energy: [
        { name: 'Mon', value: 4.8 },
        { name: 'Tue', value: 5.2 },
        { name: 'Wed', value: 4.9 },
        { name: 'Thu', value: 5.5 },
        { name: 'Fri', value: 5.1 },
        { name: 'Sat', value: 4.7 },
        { name: 'Sun', value: 5.0 },
      ],
      water: [
        { name: 'Mon', value: 280 },
        { name: 'Tue', value: 295 },
        { name: 'Wed', value: 310 },
        { name: 'Thu', value: 275 },
        { name: 'Fri', value: 290 },
        { name: 'Sat', value: 270 },
        { name: 'Sun', value: 285 },
      ],
      currentEnergy: { value: 5.2, trend: 15 },
      currentWater: { value: 290, trend: -8 }
    }
  };

  const handleZoneChange = (event) => {
    setSelectedZone(event.target.value);
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="dashboard-page">
      <FloatingIcons />
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        style={{ position: 'relative', zIndex: 10 }}
      />
      
      <motion.div
        className="dashboard-content"
        animate={{
          marginLeft: sidebarOpen ? "300px" : "0px"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="dashboard-header">
          <div className="header-left">
            <IconButton 
              className="filter-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FilterList />
            </IconButton>
            <h1 className="dashboard-title">Resource Dashboard</h1>
          </div>
          <div className="header-right">
            <span className="zone-label">Select Zone:</span>
            <FormControl className="zone-selector">
              <Select
                value={selectedZone}
                onChange={handleZoneChange}
                className="zone-select"
                displayEmpty
              >
                <MenuItem value="zoneA">Zone A</MenuItem>
                <MenuItem value="zoneB">Zone B</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <AlertTicker />
        
        <div className="dashboard-grid">
          <motion.div
            className="dashboard-card large"
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
          >
            <div className="chart-header">
              <BoltOutlined className="chart-icon energy" sx={{ fontSize: 40 }} />
              <h2>Energy Consumption - {selectedZone === 'zoneA' ? 'Zone A' : 'Zone B'}</h2>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={zoneData[selectedZone].energy}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--primary)" 
                    fill="var(--primary-light)" 
                    fillOpacity={0.2}
                    animationDuration={1500}
                    animationBegin={300}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            className="dashboard-card large"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="chart-header">
              <Opacity className="chart-icon water" sx={{ fontSize: 40 }} />
              <h2>Water Usage - {selectedZone === 'zoneA' ? 'Zone A' : 'Zone B'}</h2>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={zoneData[selectedZone].water}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#4a5568"
                    tick={{ fill: '#4a5568' }}
                  />
                  <YAxis 
                    stroke="#4a5568"
                    tick={{ fill: '#4a5568' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4299e1" 
                    strokeWidth={3}
                    dot={{ fill: '#4299e1', strokeWidth: 2 }}
                    activeDot={{ 
                      r: 6, 
                      fill: '#4299e1',
                      stroke: 'white',
                      strokeWidth: 2
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="metric-header">
              <BoltOutlined className="metric-icon energy" sx={{ fontSize: 32 }} />
              <h3>Current Energy</h3>
            </div>
            <p className="metric-value">{zoneData[selectedZone].currentEnergy.value} kWh</p>
            <div className={`metric-trend ${zoneData[selectedZone].currentEnergy.trend > 0 ? 'positive' : 'negative'}`}>
              {zoneData[selectedZone].currentEnergy.trend > 0 ? <TrendingUp /> : <TrendingDown />}
              {Math.abs(zoneData[selectedZone].currentEnergy.trend)}%
            </div>
          </motion.div>

          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="metric-header">
              <Opacity className="metric-icon water" sx={{ fontSize: 32 }} />
              <h3>Current Water</h3>
            </div>
            <p className="metric-value">{zoneData[selectedZone].currentWater.value} L/hr</p>
            <div className={`metric-trend ${zoneData[selectedZone].currentWater.trend > 0 ? 'positive' : 'negative'}`}>
              {zoneData[selectedZone].currentWater.trend > 0 ? <TrendingUp /> : <TrendingDown />}
              {Math.abs(zoneData[selectedZone].currentWater.trend)}%
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
