import express from 'express';
import aiRoutes from './ai.routes.mjs';
import electricityRoutes from './electricity.routes.mjs';
import damRoutes from './damRoutes.js'; // Proper ES Module import

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Dashboard data
router.get('/dashboard', (req, res) => {
    res.json({
        stats: {
            totalUsers: 100,
            activeProjects: 25,
            completedTasks: 150
        }
    });
});

// Stats data
router.get('/statistics', (req, res) => {
    res.json({
        monthlyStats: [
            { month: 'Jan', value: 65 },
            { month: 'Feb', value: 75 },
            { month: 'Mar', value: 85 }
        ]
    });
});

// Features list
router.get('/features', (req, res) => {
    res.json({
        features: [
            { id: 1, name: 'Task Management' },
            { id: 2, name: 'Resource Planning' },
            { id: 3, name: 'Time Tracking' }
        ]
    });
});

// Mount the dam routes properly at /dams to match frontend expectation
router.use('/dams', damRoutes);

// Mount specific route modules for zones if available
try {
  // Try to import these modules, but don't crash if they're not available
  const zoneRoutes = require('./zoneRoutes.js').default;
  router.use('/zone', zoneRoutes);
} catch (error) {
  console.log('Zone routes not available:', error.message);
}

// These are ES modules and should work
router.use('/ai', aiRoutes);
router.use('/electricity', electricityRoutes);

export default router;