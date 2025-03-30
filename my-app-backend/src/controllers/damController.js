import { dams } from '../data/damData.js';
import { getPredictions } from '../services/ai.service.mjs';

export const getDamSystems = async (req, res) => {
  try {
    res.json(dams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDamById = async (req, res) => {
  try {
    const dam = dams.find(d => d.id === req.params.id);
    if (!dam) {
      return res.status(404).json({ message: 'Dam not found' });
    }
    res.json(dam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addWaterReading = async (req, res) => {
  try {
    const dam = dams.find(d => d.id === req.params.id);
    if (!dam) {
      return res.status(404).json({ message: 'Dam not found' });
    }

    const { waterLevel, flowRate, releaseRate, precipitation } = req.body;
    
    // Add new reading
    const newReading = {
      timestamp: new Date(),
      waterLevel,
      flowRate,
      releaseRate,
      precipitation
    };
    
    dam.readings.push(newReading);
    dam.currentLevel = waterLevel;
    
    // Update status based on thresholds
    if (waterLevel >= dam.criticalLevel) {
      dam.status = 'critical';
    } else if (waterLevel >= dam.safetyThreshold) {
      dam.status = 'warning';
    } else {
      dam.status = 'normal';
    }

    // Get AI predictions for water management
    const prediction = await getPredictions({
      readings: dam.readings.slice(-24), // Last 24 readings
      currentLevel: waterLevel,
      flowRate,
      precipitation,
      safetyThreshold: dam.safetyThreshold,
      criticalLevel: dam.criticalLevel
    });

    res.json({ dam, prediction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDamSystem = async (req, res) => {
  try {
    const { safetyThreshold, criticalLevel } = req.body;
    const dam = dams.find(d => d.id === req.params.id);
    
    if (!dam) {
      return res.status(404).json({ message: 'Dam not found' });
    }
    
    dam.safetyThreshold = safetyThreshold;
    dam.criticalLevel = criticalLevel;
    
    res.json(dam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};