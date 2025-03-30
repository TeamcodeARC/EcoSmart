import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def load_and_prepare_data(filepath):
    # Load the data
    df = pd.read_csv(filepath)
    
    # Create features from the available columns
    df['PreviousMonthBill'] = df['ElectricityBill'].shift(1).fillna(0)
    df['TwoMonthsAgoBill'] = df['ElectricityBill'].shift(2).fillna(0)
    
    X = df[['Fan', 'Refrigerator', 'AirConditioner', 'Television', 
            'Monitor', 'MotorPump', 'Month', 'MonthlyHours', 'TariffRate',
            'PreviousMonthBill', 'TwoMonthsAgoBill']]
    
    y = df['ElectricityBill']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler

def preprocess_input(input_data):
    """
    Preprocess input data from frontend to match the format expected by the model
    
    Args:
        input_data: Dictionary with input values from frontend
        
    Returns:
        Numpy array of preprocessed features ready for scaling
    """
    # Map frontend field names to model input features
    feature_mapping = {
        'fan': 'Fan',
        'refrigerator': 'Refrigerator',
        'airConditioner': 'AirConditioner',
        'television': 'Television',
        'monitor': 'Monitor',
        'motorPump': 'MotorPump',
        'month': 'Month',
        'monthlyHours': 'MonthlyHours',
        'tariffRate': 'TariffRate',
        'previousMonthBill': 'PreviousMonthBill',
        'twoMonthsAgoBill': 'TwoMonthsAgoBill'
    }
    
    # Extract features in the correct order
    features = []
    for frontend_name, model_name in feature_mapping.items():
        if frontend_name in input_data:
            features.append(float(input_data[frontend_name]))
        else:
            # Use default values if a feature is missing
            if model_name == 'Fan':
                features.append(5.0)
            elif model_name == 'Refrigerator':
                features.append(24.0)
            elif model_name == 'AirConditioner':
                features.append(6.0)
            elif model_name == 'Television':
                features.append(4.0)
            elif model_name == 'Monitor':
                features.append(8.0)
            elif model_name == 'MotorPump':
                features.append(1.0)
            elif model_name == 'Month':
                features.append(pd.Timestamp.now().month)
            elif model_name == 'MonthlyHours':
                features.append(720.0)
            elif model_name == 'TariffRate':
                features.append(5.0)
            elif model_name == 'PreviousMonthBill':
                features.append(150.0)
            elif model_name == 'TwoMonthsAgoBill':
                features.append(145.0)
    
    return features
