import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Card, Grid, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, DialogContentText, FormControl, InputAdornment } from '@mui/material';
import { TrendingUp, Warning, BoltOutlined } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FloatingIcons } from './FloatingIcons';

const generateMockData = (zone) => {
  const data = [];
  const baseValue = zone === 'A' ? 100 : 80;  // Different base values for each zone
  let trend = 0;

  for (let i = 0; i < 24; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (24 - i));
    
    // Different trends for each zone
    trend += (Math.random() - 0.5) * (zone === 'A' ? 10 : 8);
    const value = baseValue + trend;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      historical: i < 18 ? value : null,
      forecast: i >= 12 ? value * (1 + (i - 12) * (zone === 'A' ? 0.03 : 0.02)) : null,
      threshold: zone === 'A' ? 150 : 120,
      confidence: i >= 12 ? [value * 0.9, value * 1.1] : null
    });
  }
  return data;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        backgroundColor: 'white',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1 }}>{label}</Typography>
      {payload.map((entry, index) => {
        if (!entry.value) return null;
        const isNearThreshold = entry.name === 'forecast' && entry.value > 140;
        
        return (
          <Box key={index} sx={{ color: isNearThreshold ? 'error.main' : 'text.primary' }}>
            <Typography variant="body2">
              {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}: {entry.value.toFixed(1)}
              {isNearThreshold && (
                <Chip
                  size="small"
                  icon={<Warning />}
                  label="Near Threshold"
                  color="error"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
          </Box>
        );
      })}
    </motion.div>
  );
};

const LegendItem = ({ color, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
    <Box
      sx={{
        width: 40,
        height: 3,
        backgroundColor: color,
        mr: 1,
        ...(label === 'Forecast' && { borderStyle: 'dashed', borderWidth: '1px' })
      }}
    />
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Box>
);

export const PredictiveAnalytics = () => {
  const [zoneAData, setZoneAData] = useState([]);
  const [zoneBData, setZoneBData] = useState([]);
  const [openBillPredict, setOpenBillPredict] = useState(false);
  const [predictions, setPredictions] = useState({ zoneA: 0, zoneB: 0 });
  const [openManualInput, setOpenManualInput] = useState(false);
  const [manualUsage, setManualUsage] = useState({
    fan: 0,
    refrigerator: 24, // Default 24 hours for refrigerator
    airConditioner: 0,
    television: 0,
    monitor: 0,
    motorPump: 0
  });
  const [tariffRate, setTariffRate] = useState(0.15); // Default tariff rate
  const [manualBill, setManualBill] = useState(0);

  const calculateBillPrediction = (data) => {
    const lastSixMonths = data.slice(-6);
    const avgUsage = lastSixMonths.reduce((sum, point) => 
      sum + (point.forecast || point.historical || 0), 0) / 6;
    return (avgUsage * 0.15 * 30).toFixed(2); // Assuming $0.15 per unit per day
  };

  const calculateManualBill = () => {
    // Standard power consumption in watts for each appliance
    const powerRatings = {
      fan: 75,
      refrigerator: 150,
      airConditioner: 1500,
      television: 100,
      monitor: 35,
      motorPump: 750
    };

    const dailyConsumption = Object.entries(manualUsage).reduce((total, [appliance, hours]) => {
      const wattsPerDay = (powerRatings[appliance] * hours) / 1000; // Convert to kWh
      return total + wattsPerDay;
    }, 0);

    const monthlyBill = (dailyConsumption * 30 * tariffRate).toFixed(2); // 30 days * tariff rate per kWh
    setManualBill(monthlyBill);
  };

  const handleManualInputChange = (appliance) => (event) => {
    setManualUsage(prev => ({
      ...prev,
      [appliance]: Number(event.target.value)
    }));
  };

  const handleTariffChange = (event) => {
    setTariffRate(Number(event.target.value));
  };

  const handlePredictBill = () => {
    setPredictions({
      zoneA: calculateBillPrediction(zoneAData),
      zoneB: calculateBillPrediction(zoneBData)
    });
    setOpenBillPredict(true);
  };

  useEffect(() => {
    setZoneAData(generateMockData('A'));
    setZoneBData(generateMockData('B'));
  }, []);

  const renderChart = (data, title, trend) => (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ p: 3, height: '500px', mb: 3 }}
    >
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{title}</Typography>
          <Chip
            icon={<TrendingUp />}
            label={trend}
            color="primary"
            size="small"
          />
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
          <LegendItem color="#2196f3" label="Historical Data" />
          <LegendItem color="#ff9800" label="Forecast" />
          <LegendItem color="#f44336" label="Threshold" />
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="historical"
            stroke="#2196f3"
            strokeWidth={2}
            dot={{ r: 4 }}
            animationDuration={1500}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#ff9800"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={{ r: 4 }}
            animationDuration={1500}
          />
          <Line
            type="monotone"
            dataKey="threshold"
            stroke="#f44336"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );

  return (
    <Box 
      sx={{ 
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <FloatingIcons />
      <Box 
        sx={{ 
          position: 'relative',
          zIndex: 1,
          maxWidth: 1200,
          margin: '0 auto',
          padding: '24px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>Predictive Analytics</Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<BoltOutlined />}
              onClick={() => setOpenManualInput(true)}
              sx={{ mb: 2, mr: 2 }}
            >
              Manual Usage Input
            </Button>
            <Button
              variant="contained"
              startIcon={<BoltOutlined />}
              onClick={handlePredictBill}
              sx={{ mb: 2 }}
            >
              Predict Electricity Bill
            </Button>
          </Box>
        </Box>

        <Dialog 
          open={openManualInput} 
          onClose={() => setOpenManualInput(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Manual Usage Input</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Enter the monthly hours of usage for each appliance and tariff rate
            </DialogContentText>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <TextField
                label="Tariff Rate"
                type="number"
                value={tariffRate}
                onChange={handleTariffChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">per kWh</InputAdornment>,
                }}
                helperText="Enter your local electricity tariff rate"
              />
            </FormControl>

            {Object.entries(manualUsage).map(([appliance, hours]) => (
              <FormControl fullWidth sx={{ mb: 2 }} key={appliance}>
                <TextField
                  label={appliance
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())}
                  type="number"
                  value={hours}
                  onChange={handleManualInputChange(appliance)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">hours/month</InputAdornment>,
                  }}
                  helperText={`Typical power: ${{
                    fan: 75,
                    refrigerator: 150,
                    airConditioner: 1500,
                    television: 100,
                    monitor: 35,
                    motorPump: 750
                  }[appliance]}W`}
                />
              </FormControl>
            ))}
            
            {manualBill > 0 && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="h6" color="white">
                  Estimated Monthly Bill: ${manualBill}
                </Typography>
                <Typography variant="body2" color="white">
                  Total Monthly Consumption: {(manualBill / tariffRate).toFixed(2)} kWh
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenManualInput(false)}>Close</Button>
            <Button onClick={calculateManualBill} variant="contained">
              Calculate Bill
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openBillPredict} onClose={() => setOpenBillPredict(false)}>
          <DialogTitle>Monthly Bill Predictions</DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>Zone A</Typography>
            <Typography variant="body1" color="primary" gutterBottom>
              Estimated Bill: ${predictions.zoneA}
            </Typography>
            <Typography variant="h6" gutterBottom>Zone B</Typography>
            <Typography variant="body1" color="primary" gutterBottom>
              Estimated Bill: ${predictions.zoneB}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBillPredict(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            {renderChart(zoneAData, "Zone A Performance Forecast", "High Growth Trend")}
            {renderChart(zoneBData, "Zone B Performance Forecast", "Stable Growth Trend")}
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              sx={{ p: 3 }}
            >
              <Typography variant="h6" gutterBottom>Zone A Insights</Typography>
              <Typography variant="body2" color="text.secondary">
                Zone A shows aggressive growth with potential threshold breaches in Q3 2024.
                Higher volatility observed. Confidence level: 85%
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              sx={{ p: 3 }}
            >
              <Typography variant="h6" gutterBottom>Zone B Insights</Typography>
              <Typography variant="body2" color="text.secondary">
                Zone B demonstrates stable growth with moderate risk levels.
                Consistent performance expected. Confidence level: 92%
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PredictiveAnalytics;
