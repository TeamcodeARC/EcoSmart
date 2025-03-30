import express from 'express';
import { getDamSystems, getDamById, addWaterReading, updateDamSystem } from '../controllers/damController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Development environment check to bypass authentication if needed
const isDev = process.env.NODE_ENV === 'development';
const authMiddleware = isDev ? (req, res, next) => next() : authenticateToken;

// Remove nested 'dams' path since we're already mounting at /api/dams
router.get('/', authMiddleware, getDamSystems);
router.get('/:id', authMiddleware, getDamById);
router.post('/:id/readings', authMiddleware, addWaterReading);
router.put('/:id', authMiddleware, updateDamSystem);

export default router;