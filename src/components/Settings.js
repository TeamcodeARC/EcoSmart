import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import {
  Box, Tabs, Tab, Typography, Card, Switch,
  TextField, Avatar, Button, Divider, Slider, Alert
} from '@mui/material';
import {
  Person, Notifications, Security, CameraAlt, Edit, Tune
} from '@mui/icons-material';

const AnimatedTab = ({ children, value, index }) => (
  <AnimatePresence mode="wait">
    {value === index && (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const AnimatedSwitch = ({ label, checked, onChange }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
    <Typography>{label}</Typography>
    <motion.div whileTap={{ scale: 0.95 }}>
      <Switch
        checked={checked}
        onChange={onChange}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: 'primary.main',
            '& + .MuiSwitch-track': {
              backgroundColor: 'primary.main',
            },
          },
        }}
      />
    </motion.div>
  </Box>
);

const ThresholdSlider = ({ label, value, onChange, min, max, unit }) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  return (
    <Box sx={{ my: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>{label}</Typography>
        <motion.div
          key={displayValue}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Typography color="primary.main" fontWeight="bold">
            {displayValue}{unit}
          </Typography>
        </motion.div>
      </Box>
      <Slider
        value={value}
        onChange={(_, newValue) => {
          setDisplayValue(newValue);
          onChange(newValue);
        }}
        min={min}
        max={max}
        valueLabelDisplay="auto"
        sx={{
          '& .MuiSlider-thumb': {
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.2)',
            },
          },
        }}
      />
    </Box>
  );
};

export const Settings = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    bio: ''
  });
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: true,
    darkMode: false,
  });
  const [thresholds, setThresholds] = useState({
    cpuUsage: 80,
    memoryUsage: 85,
    diskSpace: 90,
    networkLatency: 100
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const updateThreshold = (key, value) => {
    setThresholds(prev => ({
      ...prev,
      [key]: value
    }));
    setToastMessage(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} threshold updated`);
    setShowToast(true);
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = () => {
    updateUser({
      ...user,
      ...profileData
    });
    setToastMessage('Profile updated successfully');
    setShowToast(true);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      
      <Card sx={{ mt: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Person />} label="Profile" />
          <Tab icon={<Notifications />} label="Notifications" />
          <Tab icon={<Security />} label="Security" />
          <Tab icon={<Tune />} label="Thresholds" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <AnimatedTab value={activeTab} index={0}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 80, height: 80 }}>
                  {profileData.fullName?.charAt(0) || 'U'}
                </Avatar>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CameraAlt />}
                    size="small"
                  >
                    Change Photo
                  </Button>
                </motion.div>
              </Box>
              <TextField
                label="Name"
                name="fullName"
                value={profileData.fullName}
                onChange={handleProfileChange}
              />
              <TextField
                label="Email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
              />
              <TextField
                label="Bio"
                name="bio"
                value={profileData.bio}
                onChange={handleProfileChange}
                multiline
                rows={4}
              />
              <Button 
                variant="contained"
                onClick={handleProfileUpdate}
              >
                Save Changes
              </Button>
            </Box>
          </AnimatedTab>

          <AnimatedTab value={activeTab} index={1}>
            <AnimatedSwitch
              label="Email Notifications"
              checked={settings.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
            <Divider />
            <AnimatedSwitch
              label="Push Notifications"
              checked={settings.pushNotifications}
              onChange={() => handleToggle('pushNotifications')}
            />
            <Divider />
            <AnimatedSwitch
              label="Dark Mode"
              checked={settings.darkMode}
              onChange={() => handleToggle('darkMode')}
            />
          </AnimatedTab>

          <AnimatedTab value={activeTab} index={2}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <AnimatedSwitch
                label="Two-Factor Authentication"
                checked={settings.twoFactorAuth}
                onChange={() => handleToggle('twoFactorAuth')}
              />
              <Divider />
              <Button
                variant="outlined"
                color="error"
                startIcon={<Edit />}
              >
                Change Password
              </Button>
              <Typography variant="body2" color="text.secondary">
                Last password change: 30 days ago
              </Typography>
            </Box>
          </AnimatedTab>

          <AnimatedTab value={activeTab} index={3}>
            <Typography variant="h6" gutterBottom>Alert Thresholds</Typography>
            <Box sx={{ mt: 2 }}>
              <ThresholdSlider
                label="CPU Usage Alert"
                value={thresholds.cpuUsage}
                onChange={(value) => updateThreshold('cpuUsage', value)}
                min={50}
                max={95}
                unit="%"
              />
              <ThresholdSlider
                label="Memory Usage Alert"
                value={thresholds.memoryUsage}
                onChange={(value) => updateThreshold('memoryUsage', value)}
                min={50}
                max={95}
                unit="%"
              />
              <ThresholdSlider
                label="Disk Space Alert"
                value={thresholds.diskSpace}
                onChange={(value) => updateThreshold('diskSpace', value)}
                min={60}
                max={95}
                unit="%"
              />
              <ThresholdSlider
                label="Network Latency Alert"
                value={thresholds.networkLatency}
                onChange={(value) => updateThreshold('networkLatency', value)}
                min={50}
                max={200}
                unit="ms"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setToastMessage('All thresholds saved successfully');
                    setShowToast(true);
                  }}
                >
                  Save All Thresholds
                </Button>
              </motion.div>
            </Box>
          </AnimatedTab>
        </Box>
      </Card>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 2000
            }}
            onAnimationComplete={() => {
              setTimeout(() => setShowToast(false), 2000);
            }}
          >
            <Alert severity="success" sx={{ boxShadow: 2 }}>
              {toastMessage}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};
