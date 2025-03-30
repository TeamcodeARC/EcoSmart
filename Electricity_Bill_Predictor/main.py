from data_preparation import load_and_prepare_data
from model import EnergyPredictor
import pandas as pd
import joblib

def main():
    filepath = 'electricity_bill_dataset.csv'
    
    try:
        # Debug: Print the contents of the CSV file
        df = pd.read_csv(filepath)
        print("Available columns:", df.columns.tolist())
        print("\nFirst few rows of data:")
        print(df.head())
        
        # Prepare data
        X_train_scaled, X_test_scaled, y_train, y_test, scaler = load_and_prepare_data(filepath)
        
        # Create and train the model
        predictor = EnergyPredictor()
        predictor.fit(X_train_scaled, y_train)
        
        # Evaluate the model
        metrics = predictor.evaluate(X_test_scaled, y_test)
        print("\nModel Performance:")
        for metric, value in metrics.items():
            print(f"{metric}: {value:.4f}")
        
        # Save the model and scaler
        predictor.save_models('energy_predictor')
        joblib.dump(scaler, 'scaler.joblib')
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()
