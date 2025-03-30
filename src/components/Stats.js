import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { FaWater, FaBolt, FaLeaf, FaChartLine } from 'react-icons/fa';
import '../styles/Stats.css';

const stats = [
  {
    icon: <FaWater />,
    value: 850000,
    suffix: 'L',
    label: 'Water Saved',
    color: '#4299e1'
  },
  {
    icon: <FaBolt />,
    value: 125000,
    suffix: 'kWh',
    label: 'Energy Saved',
    color: '#f6ad55'
  },
  {
    icon: <FaLeaf />,
    value: 45,
    suffix: '%',
    label: 'Carbon Reduced',
    color: '#68d391'
  },
  {
    icon: <FaChartLine />,
    value: 98,
    suffix: '%',
    label: 'Efficiency Rate',
    color: '#fc8181'
  }
];

export const Stats = () => {
  return (
    <section className="stats-section">
      <motion.div
        className="stats-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Resource Management Statistics</h1>
        <p>Track your organization's impact on sustainability and efficiency</p>
      </motion.div>
      <div className="stats-container">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-value">
              <CountUp
                end={stat.value}
                duration={2.5}
                separator=","
                suffix={stat.suffix}
              />
            </div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
