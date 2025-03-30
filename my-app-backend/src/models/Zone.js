import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  energyValue: {
    type: Number,
    required: true
  },
  waterValue: {
    type: Number,
    required: true
  }
});

const zoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  readings: [readingSchema],
  currentEnergy: {
    value: Number,
    trend: Number
  },
  currentWater: {
    value: Number,
    trend: Number
  }
});

const Zone = mongoose.model('Zone', zoneSchema);
export default Zone;
