import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to Electricity Bill Predictor Python directory
const pythonDir = path.resolve(__dirname, '../../../Electricity_Bill_Predictor');

// Helper function to execute Python script
const executePythonScript = (scriptName, args = []) => {
  return new Promise((resolve, reject) => {
    // Ensure the Python directory exists
    if (!fs.existsSync(pythonDir)) {
      reject(new Error(`Python directory not found: ${pythonDir}`));
      return;
    }

    const scriptPath = path.join(pythonDir, scriptName);
    
    // Ensure the script exists
    if (!fs.existsSync(scriptPath)) {
      reject(new Error(`Python script not found: ${scriptPath}`));
      return;
    }

    // Spawn a Python process
    const pythonProcess = spawn('python', [scriptPath, ...args]);
    
    let resultData = '';
    let errorData = '';

    // Collect data from the script
    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${errorData}`));
        return;
      }
      
      try {
        // Try to parse the result as JSON
        const result = JSON.parse(resultData);
        resolve(result);
      } catch (error) {
        resolve(resultData);
      }
    });
  });
};

// Get historical electricity usage data
router.get('/history', async (req, res) => {
  try {
    // Call Python script to get historical data
    const result = await executePythonScript('get_historical_data.py');
    res.json(result);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Predict electricity bill
router.post('/predict', async (req, res) => {
  try {
    // Extract input data from request body
    const inputData = req.body;
    
    // Save input data to a temporary JSON file
    const tempFilePath = path.join(pythonDir, 'temp_input.json');
    fs.writeFileSync(tempFilePath, JSON.stringify(inputData));
    
    // Call Python script for prediction
    const result = await executePythonScript('predict_bill.py', [tempFilePath]);
    
    // Clean up temporary file
    fs.unlinkSync(tempFilePath);
    
    res.json(result);
  } catch (error) {
    console.error('Error predicting bill:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get model performance metrics
router.get('/model-performance', async (req, res) => {
  try {
    // Call Python script to get model performance metrics
    const result = await executePythonScript('get_model_performance.py');
    res.json(result);
  } catch (error) {
    console.error('Error fetching model performance:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;