import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Typography, TextField, Button, Card,
  CircularProgress, Alert, IconButton
} from '@mui/material';
import { Send, CheckCircle, Close } from '@mui/icons-material';
import styled from '@emotion/styled';

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    transition: border-color 0.3s ease;
    
    &:hover fieldset {
      border-color: ${props => props.theme.palette.primary.main};
    }
    
    &.Mui-focused fieldset {
      border-width: 2px;
      transition: border-width 0.3s ease;
    }
  }
`;

const formFields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'subject', label: 'Subject', type: 'text' },
  { name: 'message', label: 'Message', type: 'text', multiline: true, rows: 4 }
];

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>Contact Us</Typography>
        
        <Card sx={{ p: 3, mt: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {formFields.map((field) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <StyledTextField
                    fullWidth
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange}
                    multiline={field.multiline}
                    rows={field.rows}
                    required
                  />
                </motion.div>
              ))}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                  sx={{ height: 48 }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </motion.div>
            </Box>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  severity="error"
                  sx={{ mt: 2 }}
                  action={
                    <IconButton
                      size="small"
                      onClick={() => setError('')}
                    >
                      <Close />
                    </IconButton>
                  }
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2000
              }}
            >
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: '50%',
                  p: 2,
                  boxShadow: 3
                }}
              >
                <CheckCircle
                  color="success"
                  sx={{ fontSize: 60 }}
                />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Box>
  );
};
