import Zone from '../models/Zone.js';

export const getZones = async (req, res) => {
  try {
    const zones = await Zone.find();
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getZoneById = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    res.json(zone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addReading = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    const { energyValue, waterValue } = req.body;
    
    zone.readings.push({ energyValue, waterValue });
    
    // Update current values and calculate trends
    const previousEnergy = zone.currentEnergy.value || 0;
    const previousWater = zone.currentWater.value || 0;
    
    zone.currentEnergy = {
      value: energyValue,
      trend: previousEnergy ? ((energyValue - previousEnergy) / previousEnergy) * 100 : 0
    };
    
    zone.currentWater = {
      value: waterValue,
      trend: previousWater ? ((waterValue - previousWater) / previousWater) * 100 : 0
    };

    await zone.save();
    res.json(zone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
