import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navigation.css';

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <Link 
          to="/"
          className="logo"
          onClick={handleLogoClick}
        >
          EcoSmart
        </Link>
        <div className="nav-links">
          {/* Always show all navigation links - no authentication check */}
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/statistics" className="nav-link">Statistics</Link>
          <Link to="/predictive" className="nav-link">Predictive</Link>
          <Link to="/dam-management" className="nav-link">Dam Management</Link>
          <Link to="/electricity-bill" className="nav-link">Electricity Bill Predictor</Link>
          <Link to="/reports" className="nav-link">Reports</Link>
          <Link to="/alerts" className="nav-link">Alerts</Link>
        </div>
      </div>
    </nav>
  );
};
