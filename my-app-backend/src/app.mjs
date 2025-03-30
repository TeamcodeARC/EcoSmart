import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import routes from './routes/index.mjs';

// Load environment variables at the very beginning
dotenv.config({ debug: process.env.NODE_ENV === 'development' });

// Debug: Log environment variables (excluding sensitive values)
console.log('Environment loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.PORT,
  OPENAI_API_KEY_SET: !!process.env.OPENAI_API_KEY
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Use routes
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
