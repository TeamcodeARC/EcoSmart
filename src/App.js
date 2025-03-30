import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import './App.css';
import { Navigation } from './components/Navigation';
import { WaterRipple } from './components/WaterRipple';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Features } from './components/Features';
import { Dashboard } from './components/Dashboard';
import { Alerts } from './components/Alerts';
import { Reports } from './components/Reports';
import { DamManagement } from './components/DamManagement';
import PredictiveAnalytics from './components/PredictiveAnalytics';
import ElectricityBillPredictor from './components/ElectricityBillPredictor';
import { Settings } from './components/Settings';
import { Help } from './components/Help';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { fadeIn } from './utils/animations';

function MainContent() {
  return (
    <motion.div
      className="content-wrapper"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <Hero />
    </motion.div>
  );
}

// Separate component for routes to use router hooks
function AppContent() {
  const location = useLocation();
  const showFooterPaths = ['/', '/contact'];
  const shouldShowFooter = showFooterPaths.includes(location.pathname);

  return (
    <div className="App">
      <Navigation />
      <WaterRipple />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/statistics" element={<Stats />} />
        <Route path="/features" element={<Features />} />
        <Route path="/dam-management" element={<DamManagement />} />
        <Route path="/electricity-bill" element={<ElectricityBillPredictor />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/predictive" element={<PredictiveAnalytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}

export default App;
