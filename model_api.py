from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
from dam_water_prediction_model import DamWaterPredictionModel
from datetime import datetime
import logging
import traceback
import sys
import json

# Configure logging to output to console
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Load the trained model
model = None
try:
    model_path = 'dam_model_improved.joblib'
    logger.info(f"Checking if model file exists at: {os.path.abspath(model_path)}")
    
    if os.path.exists(model_path):
        logger.info(f"Model file found. File size: {os.path.getsize(model_path)} bytes")
        try:
            model = DamWaterPredictionModel(model_path)
            logger.info("Model loaded successfully")
        except Exception as load_err:
            logger.error(f"Failed to load existing model: {str(load_err)}")
            logger.error(traceback.format_exc())
    else:
        logger.error(f"Model file not found at {os.path.abspath(model_path)}")
        
        # See if we can create a model from the training data
        logger.info("Attempting to create model from training data...")
        data_path = 'synthetic_dam_readings.json'
        if os.path.exists(data_path):
            try:
                from dam_water_prediction_model import analyze_dam_data
                logger.info(f"Found training data, creating model from {data_path}...")
                model = analyze_dam_data(data_path, model_path)
                logger.info("Created and saved new model")
            except Exception as train_err:
                logger.error(f"Failed to create model from training data: {str(train_err)}")
                logger.error(traceback.format_exc())
        else:
            logger.error(f"No training data found at {os.path.abspath(data_path)}")
except Exception as e:
    logger.error(f"Error during model setup: {str(e)}")
    logger.error(traceback.format_exc())

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if not request.is_json:
            logger.error("Request is not JSON")
            return jsonify({'error': 'Content-Type must be application/json'}), 400

        try:
            data = request.get_json()
            logger.info(f"Received prediction request with data: {json.dumps(data)[:200]}...")
        except Exception as json_err:
            logger.error(f"Failed to parse JSON: {str(json_err)}")
            return jsonify({'error': 'Invalid JSON data provided'}), 400

        # Validate required fields
        required_fields = ['historicalData', 'currentLevel', 'flowRate', 'precipitation']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            error_msg = f"Missing required fields: {', '.join(missing_fields)}"
            logger.error(error_msg)
            return jsonify({'error': error_msg}), 400

        # Validate historical data format
        if not isinstance(data['historicalData'], list):
            logger.error("historicalData is not an array")
            return jsonify({'error': 'historicalData must be an array'}), 400

        if not data['historicalData']:
            logger.error("historicalData array is empty")
            return jsonify({'error': 'historicalData array is empty'}), 400

        # Validate required fields in historical data
        required_hist_fields = ['timestamp', 'waterLevel', 'flowRate', 'releaseRate', 'precipitation']
        for i, entry in enumerate(data['historicalData']):
            missing_entry_fields = [field for field in required_hist_fields if field not in entry]
            if missing_entry_fields:
                error_msg = f"Entry {i} missing fields: {', '.join(missing_entry_fields)}"
                logger.error(error_msg)
                
                # Try to auto-fix some fields
                logger.info(f"Attempting to auto-fix missing fields for entry {i}")
                for field in missing_entry_fields:
                    if field == 'releaseRate':
                        # Auto-calculate releaseRate if missing (70% of flowRate)
                        if 'flowRate' in entry:
                            entry['releaseRate'] = entry.get('flowRate', 0) * 0.7
                            logger.info(f"Auto-fixed missing releaseRate for entry {i}")
                    elif field == 'precipitation':
                        # Default precipitation to 0
                        entry['precipitation'] = 0
                        logger.info(f"Auto-fixed missing precipitation for entry {i}")
                    else:
                        return jsonify({'error': error_msg}), 400
        
        # Validate numeric fields
        numeric_fields = ['currentLevel', 'flowRate', 'precipitation']
        for field in numeric_fields:
            if not isinstance(data[field], (int, float)):
                error_msg = f'{field} must be a numeric value'
                logger.error(error_msg)
                return jsonify({'error': error_msg}), 400

        # Check if model is loaded
        if model is None:
            logger.error("Model not initialized")
            return jsonify({
                'error': 'Model not initialized. Please check server logs.'
            }), 500

        try:
            # Make predictions
            logger.info("Generating predictions...")
            predictions_df = model.predict_future_levels(data)
            predictions = predictions_df.to_dict('records')
            logger.info(f"Generated {len(predictions)} predictions")

            # Generate recommendations
            logger.info("Generating recommendations...")
            recommendations = model.generate_recommendations(
                predictions_df,
                {
                    'currentLevel': data['currentLevel'],
                    'safetyThreshold': data.get('safetyThreshold', data['currentLevel'] * 1.1),
                    'criticalLevel': data.get('criticalLevel', data['currentLevel'] * 1.2)
                }
            )
            logger.info("Generated recommendations")

            response = {
                'predictions': predictions,
                'recommendations': recommendations
            }

            logger.info("Successfully generated predictions and recommendations")
            return jsonify(response)

        except ValueError as ve:
            logger.error(f"Validation error during prediction: {str(ve)}")
            logger.error(traceback.format_exc())
            return jsonify({'error': str(ve)}), 400
        except Exception as e:
            logger.error(f"Error during prediction: {str(e)}")
            logger.error(traceback.format_exc())
            return jsonify({
                'error': 'Failed to generate predictions. Please check data format.'
            }), 500

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    try:
        status = 'healthy' if model is not None else 'model_not_loaded'
        model_info = {}
        
        if model is not None and hasattr(model, 'model'):
            model_info['model_type'] = str(type(model.model))
            model_info['has_scaler'] = hasattr(model, 'scaler')
        
        result = {
            'status': status, 
            'model_loaded': model is not None,
            'timestamp': datetime.now().isoformat(),
            'model_info': model_info,
            'cwd': os.getcwd(),
            'data_files': [f for f in os.listdir('.') if f.endswith('.json') or f.endswith('.joblib')]
        }
        
        logger.info(f"Health check: {json.dumps(result)}")
        return jsonify(result)
    except Exception as e:
        logger.error(f"Health check error: {str(e)}")
        return jsonify({'status': 'error', 'error': str(e)}), 500

@app.route('/debug', methods=['POST'])
def debug_data():
    """Endpoint to check what data format the API is receiving"""
    try:
        try:
            data = request.get_json()
        except Exception as e:
            return jsonify({'error': f'Failed to parse JSON: {str(e)}'}), 400
            
        result = {
            'received_data': data,
            'missing_fields': [field for field in ['historicalData', 'currentLevel', 'flowRate', 'precipitation'] 
                              if field not in data],
            'data_types': {k: str(type(v)) for k, v in data.items() if k in ['historicalData', 'currentLevel', 'flowRate', 'precipitation']}
        }
        
        if 'historicalData' in data and isinstance(data['historicalData'], list):
            result['historical_data_length'] = len(data['historicalData'])
            if data['historicalData']:
                result['first_entry'] = data['historicalData'][0]
                result['last_entry'] = data['historicalData'][-1]
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Debug endpoint error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)