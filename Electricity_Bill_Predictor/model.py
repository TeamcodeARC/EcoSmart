import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_squared_error
import joblib

class EnergyPredictor:
    def __init__(self):
        self.electricity_model = RandomForestRegressor(
            n_estimators=100,
            random_state=42
        )

    def fit(self, X_train, y_train):
        self.electricity_model.fit(X_train, y_train)

    def predict(self, X):
        return self.electricity_model.predict(X)

    def evaluate(self, X_test, y_test):
        predictions = self.predict(X_test)
        return {
            'r2': r2_score(y_test, predictions),
            'mse': mean_squared_error(y_test, predictions)
        }

    def save_models(self, filename_prefix):
        joblib.dump(self.electricity_model, f'{filename_prefix}_electricity.joblib')

    @classmethod
    def load_models(cls, filename_prefix):
        predictor = cls()
        predictor.electricity_model = joblib.load(f'{filename_prefix}_electricity.joblib')
        return predictor
