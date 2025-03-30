# Smart Water & Energy Management System

![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)

## Team KIT-KAT

- **Prinjal Mistry**
- **Rohit Ghosh**
- **Chirag Nahata**
- **Devanksh Sarkar**

## Project Overview

The Smart Water & Energy Management System is an integrated platform designed to monitor and predict dam water levels and electricity usage. It combines real-time IoT data with advanced AI models to provide actionable insights for efficient resource management.

Our solution addresses two critical challenges:
1. **Water Management**: Predicting dam water levels to prevent floods and optimize water usage
2. **Energy Efficiency**: Forecasting electricity consumption to reduce costs and promote sustainable usage

## Core Features

### Dam Management System
- Real-time monitoring of water levels, flow rates, and release rates
- AI-driven prediction of future water levels using historical data
- Critical alerts and recommendations for dam operators
- Interactive visualization of water level trends and forecasts

### Electricity Bill Predictor
- Machine learning model to predict electricity bills
- Historical usage analysis by appliance type
- Personalized recommendations to reduce energy consumption
- Tariff optimization suggestions

### Analytics Dashboard
- Integrated view of water and energy metrics
- Predictive analytics for resource management
- Zone-based monitoring and reporting
- User-friendly visualization of complex data

## Technology Stack

### Frontend
- React.js with Material-UI components
- Interactive charts and visualizations
- Responsive design for all devices

### Backend
- Node.js with Express
- Python ML services
- RESTful API architecture

### Machine Learning
- RandomForest regression models
- Scikit-learn for data processing
- Pandas for data manipulation
- Joblib for model serialization

### Data Storage
- MongoDB for time-series data
- JSON for configuration and model inputs

## Getting Started

### Prerequisites
- Node.js (v14+)
- Python 3.8 or higher
- MongoDB (optional for full functionality)

### Installation

1. **Clone the repository**
   ```
   git clone https://github.com/your-repo/smart-water-energy-management.git
   cd smart-water-energy-management
   ```

2. **Install frontend dependencies**
   ```
   npm install
   ```

3. **Install Python dependencies**
   ```
   cd Electricity_Bill_Predictor/Electricity_Bill_Predictor
   pip install -r requirements.txt
   ```

4. **Start the backend services**
   ```
   cd ../../my-app-backend
   npm install
   npm start
   ```

5. **Start the frontend application**
   ```
   cd ..
   npm start
   ```

6. **Start the AI prediction services**
   ```
   python model_api.py
   ```

### Available Scripts

- `npm start` - Runs the frontend app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `python model_api.py` - Starts the ML prediction API service

## Project Structure

```
├── Electricity_Bill_Predictor/ - Electricity prediction ML models
├── my-app-backend/ - Backend API services
│   ├── src/
│   │   ├── controllers/ - API request handlers
│   │   ├── models/ - Data models
│   │   ├── routes/ - API routes
│   │   └── services/ - Business logic services
├── public/ - Static assets
└── src/ - Frontend React application
    ├── components/ - UI components
    ├── contexts/ - React contexts for state management
    ├── services/ - API integration services
    ├── styles/ - Component styles
    └── utils/ - Utility functions
```

## Key Innovations

1. **Integrated Resource Management**: A unified platform for both water and energy management
2. **Predictive Analytics**: ML models for forecasting and anomaly detection
3. **Decision Support**: Actionable recommendations based on data insights
4. **Resilient Design**: Fallback mechanisms for handling API failures
5. **Scalable Architecture**: Modular design to handle additional resource types

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- This project was developed as part of the Binary Hackathon
- Thanks to all mentors and organizers for their support
