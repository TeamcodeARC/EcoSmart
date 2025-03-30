import express from 'express';
import { getZones, getZoneById, addReading } from '../controllers/zoneController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/zones', authenticateToken, getZones);
router.get('/zones/:id', authenticateToken, getZoneById);
router.post('/zones/:id/readings', authenticateToken, addReading);

export default router;
