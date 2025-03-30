import DamSystem from '../models/DamSystem.js';

const generateReadings = (count) => {
  const readings = [];
  const now = Date.now();
  const hour = 3600000; // 1 hour in milliseconds

  for (let i = 0; i < count; i++) {
    readings.push({
      timestamp: new Date(now - (count - i) * hour),
      waterLevel: 75 + Math.random() * 10,
      flowRate: 100 + Math.random() * 20,
      releaseRate: 90 + Math.random() * 15,
      precipitation: Math.random() * 5
    });
  }
  return readings;
};

export const seedDams = async () => {
  try {
    const count = await DamSystem.countDocuments();
    
    if (count === 0) {
      const dams = [
        {
          name: 'Highland Reservoir',
          location: {
            type: 'Point',
            coordinates: [-122.4194, 37.7749]
          },
          capacity: 1000000,
          currentLevel: 800000,
          safetyThreshold: 850000,
          criticalLevel: 950000,
          readings: generateReadings(24),
          status: 'normal'
        },
        {
          name: 'Valley Dam',
          location: {
            type: 'Point',
            coordinates: [-122.2711, 37.8044]
          },
          capacity: 750000,
          currentLevel: 600000,
          safetyThreshold: 650000,
          criticalLevel: 700000,
          readings: generateReadings(24),
          status: 'normal'
        }
      ];

      await DamSystem.insertMany(dams);
      console.log('Sample dam data seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding dam data:', error);
  }
};