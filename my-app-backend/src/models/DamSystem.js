import mongoose from 'mongoose';

const waterReadingSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  waterLevel: {
    type: Number,
    required: true
  },
  flowRate: {
    type: Number,
    required: true
  },
  releaseRate: {
    type: Number,
    required: true
  },
  precipitation: {
    type: Number,
    default: 0
  }
});

const damSystemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  capacity: {
    type: Number,
    required: true
  },
  currentLevel: {
    type: Number,
    required: true
  },
  safetyThreshold: {
    type: Number,
    required: true
  },
  criticalLevel: {
    type: Number,
    required: true
  },
  readings: [waterReadingSchema],
  status: {
    type: String,
    enum: ['normal', 'warning', 'critical'],
    default: 'normal'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient querying
damSystemSchema.index({ location: '2dsphere' });
damSystemSchema.index({ 'readings.timestamp': -1 });

const DamSystem = mongoose.model('DamSystem', damSystemSchema);
export default DamSystem;