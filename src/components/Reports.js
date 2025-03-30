import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, Typography, Button, Card, Grid, 
  CircularProgress, Snackbar, Alert 
} from '@mui/material';
import { 
  CheckCircleOutline, 
  PictureAsPdfOutlined, TableChartOutlined 
} from '@mui/icons-material';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const mockData = {
  monthly: [
    { month: 'Jan', incidents: 65, resolved: 45 },
    { month: 'Feb', incidents: 59, resolved: 50 },
    { month: 'Mar', incidents: 80, resolved: 75 },
    // Add more data points...
  ],
  severity: [
    { level: 'High', count: 30 },
    { level: 'Medium', count: 45 },
    { level: 'Low', count: 25 },
  ]
};

const DownloadButton = ({ label, icon, onDownload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await onDownload();
    setIsLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <Button
      variant="contained"
      startIcon={
        isLoading ? <CircularProgress size={20} color="inherit" /> :
        success ? <CheckCircleOutline /> :
        icon
      }
      onClick={handleClick}
      sx={{ minWidth: 150 }}
    >
      {isLoading ? 'Downloading...' : success ? 'Downloaded!' : label}
    </Button>
  );
};

const ChartCard = ({ title, children }) => (
  <Card
    component={motion.div}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    sx={{ p: 3, height: '100%' }}
  >
    <Typography variant="h6" gutterBottom>{title}</Typography>
    {children}
  </Card>
);

export const Reports = () => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleDownload = async (format) => {
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSnackbarMessage(`Report downloaded in ${format} format`);
    setShowSnackbar(true);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Typography variant="h4" gutterBottom>Reports & Analytics</Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <DownloadButton
          label="Export PDF"
          icon={<PictureAsPdfOutlined />}
          onDownload={() => handleDownload('PDF')}
        />
        <DownloadButton
          label="Export CSV"
          icon={<TableChartOutlined />}
          onDownload={() => handleDownload('CSV')}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ChartCard title="Monthly Incidents">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke="#8884d8"
                  strokeWidth={2}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard title="Severity Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.severity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#8884d8"
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert severity="success" onClose={() => setShowSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
