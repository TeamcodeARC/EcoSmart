import express from 'express';
import { getPredictions, checkModelHealth } from '../services/ai.service.mjs';

const router = express.Router();

router.post('/predict', async (req, res) => {
    try {
        const predictions = await getPredictions(req.body);
        res.json(predictions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/health', async (req, res) => {
    try {
        const health = await checkModelHealth();
        res.json(health);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;