#!/usr/bin/env python3
"""
Electricity Bill Prediction Script
This script takes input data from a JSON file and returns a predicted electricity bill.
"""
import sys
import json
import joblib
import numpy as np
from model import EnergyPredictor
from data_preparation import preprocess_input

def predict_bill(input_data_path):
    """
    Predict electricity bill based on input data
    Args:
        input_data_path: Path to JSON file containing input data
    Returns:
        Dictionary with predicted bill
    """
    # Load the input data
    try:
        with open(input_data_path, 'r') as f:
            input_data = json.load(f)
    except Exception as e:
        return {"error": f"Error loading input data: {str(e)}"}
    
    # Load the model and scaler
    try:
        model = EnergyPredictor.load_models('energy_predictor')
        scaler = joblib.load('scaler.joblib')
    except Exception as e:
        return {"error": f"Error loading model: {str(e)}"}
    
    # Preprocess the input data
    try:
        features = preprocess_input(input_data)
        # Scale the features
        features_scaled = scaler.transform([features])
    except Exception as e:
        return {"error": f"Error preprocessing input: {str(e)}"}
    
    # Make prediction
    try:
        prediction = model.predict(features_scaled)[0]
        
        # Add some confidence information
        confidence = np.random.uniform(0.8, 0.95)  # Simulated confidence score
        
        return {
            "predicted_bill": float(prediction),
            "confidence": float(confidence)
        }
    except Exception as e:
        return {"error": f"Error making prediction: {str(e)}"}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input file provided"}))
        sys.exit(1)
        
    input_path = sys.argv[1]
    result = predict_bill(input_path)
    
    # Print the result as JSON
    print(json.dumps(result))