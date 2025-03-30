import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Typography, Box, Chip, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Warning, Error, AccessTime, LocationOn, Search } from '@mui/icons-material';
import styled from '@emotion/styled';

const AlertCard = styled(motion.div)`
  margin: 16px;
  cursor: pointer;
`;

const FilterSection = styled(motion.div)`
  margin-bottom: 24px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const alerts = [
  {
    id: 1,
    title: 'Critical System Failure',
    description: 'Main server experiencing high latency',
    severity: 'high',
    category: 'system',
    location: 'Server Room A',
    zone: 'Zone A',
    time: '2 minutes ago',
    actions: 'Immediate system restart required',
    timestamp: new Date().getTime()
  },
  {
    id: 2,
    title: 'Network Performance Warning',
    description: 'Bandwidth usage approaching threshold',
    severity: 'medium',
    category: 'network',
    location: 'Network Hub B',
    zone: 'Zone B',
    time: '15 minutes ago',
    actions: 'Monitor network traffic',
    timestamp: new Date().getTime() - 900000
  },
  // Add more alert objects as needed
];

const cardVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.02, height: 'auto' }
};

export const Alerts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
      const matchesCategory = selectedCategory === 'all' || alert.category === selectedCategory;
      const matchesZone = selectedZone === 'all' || alert.zone === selectedZone;
      const matchesTimeframe = selectedTimeframe === 'all' || (() => {
        const hoursDiff = (new Date().getTime() - alert.timestamp) / (1000 * 60 * 60);
        switch(selectedTimeframe) {
          case '1h': return hoursDiff <= 1;
          case '24h': return hoursDiff <= 24;
          case '7d': return hoursDiff <= 168;
          default: return true;
        }
      })();

      return matchesSearch && matchesSeverity && matchesCategory && matchesTimeframe && matchesZone;
    });
  }, [searchQuery, selectedSeverity, selectedCategory, selectedTimeframe, selectedZone]);

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Alert Center</Typography>
      
      <FilterSection
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TextField
          placeholder="Search alerts..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ flexGrow: 1 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Severity</InputLabel>
          <Select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            label="Severity"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="system">System</MenuItem>
            <MenuItem value="network">Network</MenuItem>
            <MenuItem value="security">Security</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Timeframe</InputLabel>
          <Select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            label="Timeframe"
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="1h">Last Hour</MenuItem>
            <MenuItem value="24h">Last 24 Hours</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Zone</InputLabel>
          <Select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            label="Zone"
          >
            <MenuItem value="all">All Zones</MenuItem>
            <MenuItem value="Zone A">Zone A</MenuItem>
            <MenuItem value="Zone B">Zone B</MenuItem>
          </Select>
        </FormControl>
      </FilterSection>

      <AnimatePresence mode="popLayout">
        {filteredAlerts.map((alert, index) => (
          <AlertCard
            key={alert.id}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover="hover"
            transition={{ duration: 0.3, delay: index * 0.1 }}
            layout
          >
            <Card sx={{
              p: 2,
              backgroundColor: alert.severity === 'high' ? 'rgba(255,0,0,0.05)' : 'rgba(255,165,0,0.05)',
              borderLeft: `4px solid ${alert.severity === 'high' ? '#ff0000' : '#ffa500'}`
            }}>
              <div>
                <div>
                  {alert.severity === 'high' ? 
                    <Error color="error" /> : 
                    <Warning sx={{ color: 'orange' }} />
                  }
                  <Typography>{alert.title}</Typography>
                </div>
                
                <Typography>{alert.description}</Typography>
                <div>
                  <Chip 
                    icon={<LocationOn />} 
                    label={alert.location} 
                    size="small" 
                  />
                  <Chip 
                    icon={<AccessTime />} 
                    label={alert.time} 
                    size="small"
                  />
                </div>
                <Typography>
                  {alert.actions}
                </Typography>
              </div>
            </Card>
          </AlertCard>
        ))}
      </AnimatePresence>
    </Box>
  );
};
