import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Email, Phone, LocationOn } from '@mui/icons-material';
import { buttonHoverEffect, buttonTapEffect, linkHoverEffect } from '../utils/animations';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom align="center">
              EcoSmart
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Smart Resource Management Solution
              <br />
              Predict, Alert, Optimize your resources
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <motion.div whileHover={linkHoverEffect} className="interactive-element">
              <Link 
                to="/contact" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}
              >
                <Email fontSize="small" />
                <Typography variant="body2">Contact Us</Typography>
              </Link>
            </motion.div>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" />
                +1 (555) 123-4567
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" />
                123 Business Avenue, Suite 100
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Subscribe to our newsletter for updates and tips.
            </Typography>
            <motion.div whileHover={buttonHoverEffect} whileTap={buttonTapEffect} className="interactive-element">
              <Link 
                to="/contact" 
                style={{ 
                  textDecoration: 'none',
                  color: 'primary.main'
                }}
              >
                <Typography 
                  variant="button" 
                  sx={{ 
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }}
                >
                  Sign Up Now
                </Typography>
              </Link>
            </motion.div>
          </Grid>
        </Grid>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center" 
          sx={{ mt: 4 }}
        >
          © {new Date().getFullYear()} EcoSmart. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};
