import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, Typography, Card, Grid, Chip, Alert,
  LinearProgress, Button, IconButton 
} from '@mui/material';
import {
  WaterDrop, Warning, CheckCircle, Refresh,
  TrendingUp, TrendingDown
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const DamStatusChip = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'critical': return 'error';
      case 'warning': return 'warning';
      case 'normal': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'critical': return <Warning />;
      case 'warning': return <Warning />;
      case 'normal': return <CheckCircle />;
      default: return null;
    }
  };

  return (
    <Chip
      icon={getStatusIcon()}
      label={status.toUpperCase()}
      color={getStatusColor()}
      sx={{ fontWeight: 'bold' }}
    />
  );
};

export const DamManagement = () => {
  const [dams, setDams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/dams');
      setDams(response.data);
    } catch (err) {
      console.error('Error fetching dam data:', err);
      
      // Handle specific error cases
      if (err.message === 'Failed to fetch') {
        setError('Failed to connect to dam data service. Please check your network connection or try again later.');
      } else if (err.response?.status === 404) {
        setError('Dam data not found. The data source may be misconfigured.');
      } else if (err.response?.status === 500) {
        setError('Server error while fetching dam data. Please contact support if the problem persists.');
      } else if (err.response?.data?.message) {
        setError(`Failed to fetch dam data: ${err.response.data.message}`);
      } else {
        setError(`Failed to fetch dam data: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDams();
    const interval = setInterval(fetchDams, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const getWaterLevelPercentage = (current, capacity) => {
    return (current / capacity) * 100;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Dam Management System</Typography>
        <IconButton onClick={fetchDams}>
          <Refresh />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {dams.map((dam) => (
          <Grid item xs={12} key={dam._id}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{ p: 3 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">{dam.name}</Typography>
                <DamStatusChip status={dam.status} />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dam.readings.slice(-24)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(label) => new Date(label).toLocaleString()}
                      />
                      <Line
                        type="monotone"
                        dataKey="waterLevel"
                        stroke="#2196f3"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="flowRate"
                        stroke="#4caf50"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Card sx={{ p: 2, bgcolor: 'primary.light' }}>
                      <Typography variant="subtitle2" color="white">
                        Current Water Level
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WaterDrop sx={{ color: 'white' }} />
                        <Typography variant="h4" color="white">
                          {getWaterLevelPercentage(dam.currentLevel, dam.capacity).toFixed(1)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getWaterLevelPercentage(dam.currentLevel, dam.capacity)}
                        sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)' }}
                      />
                    </Card>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Card sx={{ p: 2, flex: 1 }}>
                        <Typography variant="subtitle2">Flow Rate</Typography>
                        <Typography variant="h6">
                          {dam.readings[dam.readings.length - 1]?.flowRate} m³/s
                        </Typography>
                      </Card>
                      <Card sx={{ p: 2, flex: 1 }}>
                        <Typography variant="subtitle2">Release Rate</Typography>
                        <Typography variant="h6">
                          {dam.readings[dam.readings.length - 1]?.releaseRate} m³/s
                        </Typography>
                      </Card>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};