import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime
from data_preparation import load_and_prepare_data
from model import EnergyPredictor
import joblib

st.set_page_config(page_title="Electricity Bill Predictor", layout="wide")

def load_model():
    try:
        predictor = EnergyPredictor.load_models('energy_predictor')
        scaler = joblib.load('scaler.joblib')
        return predictor, scaler
    except Exception as e:
        st.error(f"Error loading model: {str(e)}")
        return None, None

def main():
    st.title("Electricity Bill Prediction Dashboard")
    
    try:
        df = pd.read_csv('electricity_bill_dataset.csv')
    except FileNotFoundError:
        st.error("electricity_bill_dataset.csv not found. Please ensure the data file exists.")
        return
    
    # Sidebar
    st.sidebar.header("Navigation")
    page = st.sidebar.radio("Go to", ["Data Visualization", "Predictions", "Model Performance"])
    
    if page == "Data Visualization":
        st.header("Historical Data Analysis")
        
        # Appliance usage visualization
        appliances = ['Fan', 'Refrigerator', 'AirConditioner', 'Television', 'Monitor', 'MotorPump']
        for appliance in appliances:
            if appliance in df.columns:
                fig = px.line(df, y=appliance, title=f'{appliance} Usage Over Time')
                st.plotly_chart(fig)
        
        # Monthly bill visualization
        if 'ElectricityBill' in df.columns:
            fig_bill = px.bar(df, y='ElectricityBill', title='Monthly Electricity Bills')
            st.plotly_chart(fig_bill)
    
    elif page == "Predictions":
        st.header("Make Predictions")
        predictor, scaler = load_model()
        
        if predictor and scaler:
            st.subheader("Enter Appliance Usage Details")
            
            col1, col2 = st.columns(2)
            
            with col1:
                fan = st.number_input("Fan Usage (hours)", min_value=0, max_value=24, value=0)
                refrigerator = st.number_input("Refrigerator Usage (hours)", min_value=0, max_value=24, value=0)
                ac = st.number_input("Air Conditioner Usage (hours)", min_value=0, max_value=24, value=0)
            
            with col2:
                tv = st.number_input("Television Usage (hours)", min_value=0, max_value=24, value=0)
                monitor = st.number_input("Monitor Usage (hours)", min_value=0, max_value=24, value=0)
                motor = st.number_input("Motor Pump Usage (hours)", min_value=0, max_value=24, value=0)
            
            month = st.selectbox("Month", range(1, 13))
            monthly_hours = st.number_input("Monthly Hours", min_value=0, value=720)
            tariff_rate = st.number_input("Tariff Rate", min_value=0.0, value=5.0)
            
            # Add historical consumption inputs
            prev_bill = st.number_input("Previous Month's Bill ($)", min_value=0.0, value=0.0)
            two_months_bill = st.number_input("Two Months Ago Bill ($)", min_value=0.0, value=0.0)
            
            if st.button("Predict Bill"):
                try:
                    input_data = pd.DataFrame({
                        'Fan': [fan],
                        'Refrigerator': [refrigerator],
                        'AirConditioner': [ac],
                        'Television': [tv],
                        'Monitor': [monitor],
                        'MotorPump': [motor],
                        'Month': [month],
                        'MonthlyHours': [monthly_hours],
                        'TariffRate': [tariff_rate],
                        'PreviousMonthBill': [prev_bill],
                        'TwoMonthsAgoBill': [two_months_bill]
                    })
                    
                    input_scaled = scaler.transform(input_data)
                    prediction = predictor.predict(input_scaled)
                    
                    st.success(f"Predicted Electricity Bill: ${prediction[0]:.2f}")
                    
                except Exception as e:
                    st.error(f"Error making prediction: {str(e)}")
    
    else:  # Model Performance
        st.header("Model Performance Metrics")
        predictor, scaler = load_model()
        
        if predictor and scaler:
            # Evaluate model on test data
            try:
                X_train_scaled, X_test_scaled, y_train, y_test, scaler = load_and_prepare_data('electricity_bill_dataset.csv')
                metrics = predictor.evaluate(X_test_scaled, y_test)
                
                # Display metrics with better formatting
                col1, col2 = st.columns(2)
                with col1:
                    st.metric("R² Score", f"{metrics['r2']:.3f}")
                with col2:
                    st.metric("Mean Squared Error", f"{metrics['mse']:.3f}")
                
                # Add accuracy visualization
                y_pred = predictor.predict(X_test_scaled)
                
                # Create comparison plot
                comparison_df = pd.DataFrame({
                    'Actual': y_test,
                    'Predicted': y_pred
                })
                
                fig = px.scatter(comparison_df, x='Actual', y='Predicted',
                               title='Actual vs Predicted Values')
                fig.add_shape(type='line', line=dict(dash='dash'),
                            x0=y_test.min(), y0=y_test.min(),
                            x1=y_test.max(), y1=y_test.max())
                st.plotly_chart(fig)
                
                # Show percentage error distribution
                error_percent = abs((y_test - y_pred) / y_test * 100)
                fig_error = px.histogram(error_percent, title='Prediction Error Distribution (%)')
                st.plotly_chart(fig_error)
                
            except Exception as e:
                st.error(f"Error evaluating model: {str(e)}")
                st.error("Make sure the dataset file exists and contains the correct data format")

if __name__ == "__main__":
    main()
