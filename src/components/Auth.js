import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  TextField, 
  Button, 
  IconButton, 
  InputAdornment,
  Paper,
  Typography
} from '@mui/material';
import {
  EmailRounded,
  LockRounded,
  PersonRounded,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import '../styles/Auth.css';

export const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: isSignUp ? 100 : -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      fullName: isSignUp ? formData.fullName : 'Guest User',
      email: formData.email,
      createdAt: new Date().toISOString(),
      bio: ''
    });
    navigate('/features'); // Changed from /dashboard to /features
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper elevation={3} className="auth-paper">
          <motion.form
            className="auth-form"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            key={isSignUp ? 'signup' : 'signin'}
            onSubmit={handleSubmit}
          >
            <Typography variant="h4" className="auth-title">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Typography>
            
            <div className="auth-fields">
              {isSignUp && (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRounded className="field-icon" />
                      </InputAdornment>
                    ),
                  }}
                  onKeyPress={handleKeyPress}
                />
              )}

              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRounded className="field-icon" />
                    </InputAdornment>
                  ),
                }}
                onKeyPress={handleKeyPress}
              />

              <TextField
                fullWidth
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRounded className="field-icon" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onKeyPress={handleKeyPress}
              />
            </div>

            <Button 
              type="submit"
              variant="contained" 
              className="auth-submit"
              fullWidth
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>

            <Typography className="auth-switch">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <Button
                onClick={() => setIsSignUp(!isSignUp)}
                className="switch-button"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Button>
            </Typography>
          </motion.form>
        </Paper>
      </motion.div>
    </div>
  );
};
