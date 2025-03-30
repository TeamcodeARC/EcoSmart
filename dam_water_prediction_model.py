import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import os
import logging
import traceback
import json

class DamWaterPredictionModel:
    """
    Machine Learning model for predicting dam water levels and recommending actions
    based on historical water data, precipitation, and flow rates.
    """
    
    def __init__(self, model_path=None):
        """Initialize the model, optionally loading from a saved model file."""
        self.model = None
        self.scaler = StandardScaler()
        
        if model_path:
            self.load_model(model_path)
    
    def preprocess_data(self, data):
        """Preprocess the dam reading data for training or prediction."""
        if isinstance(data, list):
            df = pd.DataFrame(data)
        else:
            df = data.copy()
            
        # Convert timestamp to datetime if it's not already
        if 'timestamp' in df.columns and not pd.api.types.is_datetime64_any_dtype(df['timestamp']):
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            
        # Extract time features
        df['hour'] = df['timestamp'].dt.hour
        df['day'] = df['timestamp'].dt.day
        df['month'] = df['timestamp'].dt.month
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        
        # Calculate the rate of change for key metrics
        if len(df) > 1:
            df['waterLevel_change'] = df['waterLevel'].diff().fillna(0)
            df['flowRate_change'] = df['flowRate'].diff().fillna(0)
            df['precipitation_change'] = df['precipitation'].diff().fillna(0)
        else:
            df['waterLevel_change'] = 0
            df['flowRate_change'] = 0
            df['precipitation_change'] = 0
            
        # Drop the timestamp column as it's not usable for modeling
        df = df.drop('timestamp', axis=1, errors='ignore')
        
        return df
    
    def create_features_targets(self, df, prediction_horizon=24):
        """Create features and target variables for training."""
        # Create lag features (previous readings)
        for lag in [1, 3, 6, 12, 24]:
            if len(df) > lag:
                df[f'waterLevel_lag_{lag}'] = df['waterLevel'].shift(lag).fillna(method='bfill')
                df[f'flowRate_lag_{lag}'] = df['flowRate'].shift(lag).fillna(method='bfill')
                df[f'precipitation_lag_{lag}'] = df['precipitation'].shift(lag).fillna(method='bfill')
                df[f'releaseRate_lag_{lag}'] = df['releaseRate'].shift(lag).fillna(method='bfill')
            else:
                df[f'waterLevel_lag_{lag}'] = df['waterLevel']
                df[f'flowRate_lag_{lag}'] = df['flowRate']
                df[f'precipitation_lag_{lag}'] = df['precipitation']
                df[f'releaseRate_lag_{lag}'] = df['releaseRate']
                
        # Create the target variable - future water level
        if len(df) > prediction_horizon:
            df['future_waterLevel'] = df['waterLevel'].shift(-prediction_horizon).fillna(method='ffill')
        else:
            # If not enough data, use a simple forecasting method
            df['future_waterLevel'] = df['waterLevel'] + (df['waterLevel_change'] * prediction_horizon)
        
        # Features and target
        X = df.drop(['future_waterLevel'], axis=1)
        y = df['future_waterLevel']
        
        return X, y
    
    def train(self, historical_data, test_size=0.2, random_state=42):
        """Train the water level prediction model using historical dam data."""
        # Preprocess the data
        df = self.preprocess_data(historical_data)
        
        # Create features and targets
        X, y = self.create_features_targets(df)
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)
        
        # Scale the features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train the model
        self.model = RandomForestRegressor(n_estimators=100, random_state=random_state)
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        train_preds = self.model.predict(X_train_scaled)
        test_preds = self.model.predict(X_test_scaled)
        
        train_rmse = np.sqrt(mean_squared_error(y_train, train_preds))
        test_rmse = np.sqrt(mean_squared_error(y_test, test_preds))
        r2 = r2_score(y_test, test_preds)
        
        # Calculate feature importance
        feature_importance = pd.DataFrame({
            'feature': X.columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        return {
            'train_rmse': train_rmse,
            'test_rmse': test_rmse,
            'r2_score': r2,
            'feature_importance': feature_importance
        }
    
    def predict_future_levels(self, current_data, days_ahead=7, hours_per_prediction=3):
        """Predict future water levels for a specified number of days ahead."""
        if not self.model:
            raise ValueError("Model has not been trained yet.")
            
        # Get current readings and historical data
        historical_data = current_data.get('historicalData', [])
        current_level = current_data.get('currentLevel')
        flow_rate = current_data.get('flowRate')
        precipitation = current_data.get('precipitation')
        
        # Create a DataFrame for historical data plus current reading
        current_reading = {
            'timestamp': datetime.now(),
            'waterLevel': current_level,
            'flowRate': flow_rate,
            'precipitation': precipitation,
            'releaseRate': historical_data[-1]['releaseRate'] if historical_data else 0
        }
        
        # Combine historical and current data
        all_data = historical_data + [current_reading]
        df = self.preprocess_data(all_data)
        
        # Initialize results with the last known state
        latest_state = df.iloc[-1:].copy()
        predictions = []
        
        # Generate predictions for the specified timeframe
        total_predictions = int((days_ahead * 24) / hours_per_prediction)
        current_time = datetime.now()
        
        for i in range(total_predictions):
            # Prepare features for prediction
            X, _ = self.create_features_targets(latest_state, prediction_horizon=1)
            X_scaled = self.scaler.transform(X)
            
            # Make prediction
            pred_water_level = self.model.predict(X_scaled)[0]
            
            # Create timestamp for this prediction
            pred_time = current_time + timedelta(hours=(i+1) * hours_per_prediction)
            
            # Store prediction
            predictions.append({
                'timestamp': pred_time,
                'predicted_waterLevel': pred_water_level,
                'hours_ahead': (i+1) * hours_per_prediction
            })
            
            # Update the latest state for the next prediction
            latest_state['waterLevel'] = pred_water_level
            latest_state['hour'] = pred_time.hour
            latest_state['day'] = pred_time.day
            latest_state['month'] = pred_time.month
            latest_state['day_of_week'] = pred_time.weekday()
            
        return pd.DataFrame(predictions)
    
    def generate_recommendations(self, predictions, dam_info):
        """Generate water management recommendations based on predictions."""
        safety_threshold = dam_info.get('safetyThreshold', 0)
        critical_level = dam_info.get('criticalLevel', 0)
        current_level = dam_info.get('currentLevel', 0)
        
        # Check if any predictions exceed thresholds
        max_predicted = predictions['predicted_waterLevel'].max()
        min_predicted = predictions['predicted_waterLevel'].min()
        
        # When will it reach critical (if it will)
        will_reach_critical = predictions[predictions['predicted_waterLevel'] >= critical_level]
        time_to_critical = None
        if not will_reach_critical.empty:
            time_to_critical = will_reach_critical.iloc[0]['hours_ahead']
            
        # When will it reach warning level (if it will)
        will_reach_warning = predictions[predictions['predicted_waterLevel'] >= safety_threshold]
        time_to_warning = None
        if not will_reach_warning.empty:
            time_to_warning = will_reach_warning.iloc[0]['hours_ahead']
            
        # Generate recommendations
        recommendations = {
            'current_status': 'normal',
            'future_status': 'normal',
            'recommended_actions': [],
            'max_predicted_level': max_predicted,
            'min_predicted_level': min_predicted,
        }
        
        # Set current status
        if current_level >= critical_level:
            recommendations['current_status'] = 'critical'
        elif current_level >= safety_threshold:
            recommendations['current_status'] = 'warning'
            
        # Set future status and recommendations based on predictions
        if max_predicted >= critical_level:
            recommendations['future_status'] = 'critical'
            recommendations['time_to_critical'] = time_to_critical
            recommendations['recommended_actions'].append({
                'action': 'increase_release',
                'urgency': 'high',
                'message': f'Increase water release rate immediately. Critical level expected in {time_to_critical} hours.'
            })
        elif max_predicted >= safety_threshold:
            recommendations['future_status'] = 'warning'
            recommendations['time_to_warning'] = time_to_warning
            recommendations['recommended_actions'].append({
                'action': 'adjust_release',
                'urgency': 'medium',
                'message': f'Gradually increase release rate. Warning level expected in {time_to_warning} hours.'
            })
        else:
            recommendations['recommended_actions'].append({
                'action': 'maintain',
                'urgency': 'low',
                'message': 'Maintain current operations. No issues expected in the forecast period.'
            })
            
        return recommendations
    
    def save_model(self, filepath):
        """Save the trained model to a file."""
        if not self.model:
            raise ValueError("No trained model to save.")
            
        model_data = {
            'model': self.model,
            'scaler': self.scaler
        }
        joblib.dump(model_data, filepath)
        
    def load_model(self, filepath):
        """Load a trained model from a file."""
        model_data = joblib.load(filepath)
        self.model = model_data['model']
        self.scaler = model_data['scaler']

# Example usage function
def analyze_dam_data(dam_data_path, save_model_path=None):
    """Analyze dam data and train a prediction model."""
    try:
        # Try using json module first to handle encoding issues
        import json
        import logging

        logging.info(f"Attempting to read data from {dam_data_path}")
        
        if not os.path.exists(dam_data_path):
            raise FileNotFoundError(f"Data file not found at {dam_data_path}")

        with open(dam_data_path, 'rb') as f:
            # Skip BOM if present
            content = f.read()
            if content.startswith(b'\xef\xbb\xbf'):  # UTF-8 BOM
                content = content[3:]
            if len(content) == 0:
                raise ValueError("Data file is empty")
                
            try:
                data = json.loads(content.decode('utf-8', errors='ignore'))
            except json.JSONDecodeError as json_err:
                logging.error(f"JSON parsing error: {str(json_err)}")
                # Try handling a common issue with trailing commas
                content_str = content.decode('utf-8', errors='ignore')
                content_str = content_str.replace(',]', ']').replace(',}', '}')
                try:
                    data = json.loads(content_str)
                    logging.info("Successfully parsed JSON after fixing format issues")
                except Exception:
                    raise json_err  # Re-raise the original error if this doesn't work
                
            if not data:
                raise ValueError("No valid data found in file")
                
            df = pd.DataFrame(data)
            if df.empty:
                raise ValueError("DataFrame is empty after loading data")
                
    except FileNotFoundError as e:
        logging.error(f"File not found error: {str(e)}")
        raise
    except json.JSONDecodeError as e:
        logging.error(f"JSON parsing error: {str(e)}")
        print("Trying alternative method...")
        try:
            # Try with different encoding
            df = pd.read_json(dam_data_path, encoding='utf-8-sig')
            if df.empty:
                raise ValueError("DataFrame is empty after loading with alternative method")
        except Exception as e2:
            logging.error(f"Both data loading attempts failed. Last error: {str(e2)}")
            raise ValueError(f"Failed to load dam data from {dam_data_path}: Invalid file format or corrupted data") from e2
    except Exception as e:
        logging.error(f"Unexpected error loading data: {str(e)}")
        raise

    try:
        # Validate required columns
        required_columns = ['timestamp', 'waterLevel', 'flowRate', 'releaseRate', 'precipitation']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")

        # Initialize and train model
        model = DamWaterPredictionModel()
        logging.info(f"Training model with loaded data ({len(df)} records)...")
        training_metrics = model.train(df)

        logging.info("Model Training Complete")
        print(f"Training RMSE: {training_metrics['train_rmse']:.4f}")
        print(f"Test RMSE: {training_metrics['test_rmse']:.4f}")
        print(f"R² Score: {training_metrics['r2_score']:.4f}")

        if save_model_path:
            model.save_model(save_model_path)
            logging.info(f"Model saved to {save_model_path}")

        return model

    except Exception as e:
        logging.error(f"Error during model training: {str(e)}")
        logging.error(traceback.format_exc())
        raise ValueError(f"Failed to train model with provided data: {str(e)}") from e