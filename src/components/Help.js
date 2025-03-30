import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box, Typography, Card, Accordion, AccordionSummary,
  AccordionDetails, Button, LinearProgress, IconButton,
  Grid, Stack
} from '@mui/material';
import {
  ExpandMore, Chat, PlayArrow, Pause,
  QuestionAnswer, LiveHelp
} from '@mui/icons-material';

const faqData = [
  {
    question: "How do I set up alert thresholds?",
    answer: "Navigate to Settings > Thresholds to customize your alert levels for different metrics. Drag the sliders to adjust values and click 'Save' to apply changes."
  },
  {
    question: "Can I export reports in different formats?",
    answer: "Yes, you can export reports in PDF and CSV formats. Go to the Reports page and use the export buttons at the top of the screen."
  },
  // Add more FAQs as needed
];

const tutorials = [
  {
    id: 1,
    title: "Getting Started Guide",
    duration: "2:30",
    thumbnail: "https://placeholder.com/300x200",
    progress: 0
  },
  {
    id: 2,
    title: "Setting Up Alerts",
    duration: "3:45",
    thumbnail: "https://placeholder.com/300x200",
    progress: 0
  }
];

const VideoCard = ({ tutorial }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(tutorial.progress);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate video progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  return (
    <Card sx={{ position: 'relative' }}>
      <Box sx={{ position: 'relative', bgcolor: 'grey.100', p: 2 }}>
        <IconButton
          onClick={handlePlayPause}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': { bgcolor: 'white' }
          }}
        >
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <Typography variant="subtitle1">{tutorial.title}</Typography>
        <Typography variant="caption" color="text.secondary">
          {tutorial.duration}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: 4 }}
      />
    </Card>
  );
};

const FloatingChatButton = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.3 }}
    style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 1000
    }}
  >
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      <Button
        variant="contained"
        startIcon={<Chat />}
        sx={{
          borderRadius: 28,
          px: 3,
          py: 1.5,
          boxShadow: 3
        }}
      >
        Need Help?
      </Button>
    </motion.div>
  </motion.div>
);

export const Help = () => {
  const [expandedFaq, setExpandedFaq] = useState(false);

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Typography variant="h4" gutterBottom>Help Center</Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <QuestionAnswer /> Frequently Asked Questions
              </Typography>
              {faqData.map((faq, index) => (
                <Accordion
                  key={index}
                  expanded={expandedFaq === index}
                  onChange={() => setExpandedFaq(expandedFaq === index ? false : index)}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary">{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LiveHelp /> Video Tutorials
          </Typography>
          <Stack spacing={2}>
            {tutorials.map(tutorial => (
              <VideoCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </Stack>
        </Grid>
      </Grid>

      <FloatingChatButton />
    </Box>
  );
};
