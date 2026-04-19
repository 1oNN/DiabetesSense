# Diabetes Risk Predictor

A machine learning-powered web application that predicts an individual's risk of developing diabetes based on health metrics and lifestyle factors.

## Overview

This full-stack application combines a **React frontend** with a **Flask backend** to provide personalized diabetes risk assessments. It uses a Random Forest machine learning model trained on health data to:

- Predict diabetes risk probability
- Identify contributing health factors
- Provide personalized health recommendations
- Calculate BMI with an integrated calculator

## Features

- **Interactive Health Form**: User-friendly form collecting 19 health metrics
- **Risk Prediction**: ML-powered diabetes risk assessment
- **Contributing Factors Analysis**: Identifies key risk factors
- **Personalized Recommendations**: Tailored health advice based on risk factors
- **BMI Calculator**: Built-in tool for BMI calculation
- **Responsive Design**: Works on desktop and mobile devices
- **CORS-Enabled API**: Ready for frontend-backend integration

## Project Structure

```
diabetes_app/
├── app/                          # Flask backend
│   ├── __init__.py              # App initialization & CORS setup
│   ├── routes.py                # API endpoints
│   └── model/                   # ML models directory
│       └── random_forest_model_upsampled.joblib
├── diabetes-predictor/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── About.js
│   │   │   ├── BMICalculator.js
│   │   │   ├── Contact.js
│   │   │   ├── Footer.js
│   │   │   ├── Header.js
│   │   │   ├── Home.js
│   │   │   ├── PredictionForm.js
│   │   │   ├── Results.js
│   │   │   └── RoutesComponent.js
│   │   ├── assets/              # Images & logos
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── public/                  # Static files
│   ├── package.json
│   └── .env                     # Environment variables
├── run.py                       # Flask app entry point
├── requirements.txt             # Python dependencies
├── Procfile                     # Deployment configuration
└── scaler.joblib               # Feature scaler for ML model

```

## Tech Stack

**Backend:**
- Flask - Web framework
- Flask-CORS - Cross-Origin Resource Sharing
- scikit-learn - Machine learning
- joblib - Model serialization

**Frontend:**
- React - UI framework
- React Router - Client-side routing
- Axios - HTTP client

## Deployment

The application is configured for deployment on:
- **Heroku** (via Procfile)
- **AWS** (multiple options - see HOW_TO_RUN.md)
- **Local development**

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Quick Start

See **HOW_TO_RUN.md** for detailed setup and deployment instructions.

```bash
# Backend setup
pip install -r requirements.txt
python run.py

# Frontend setup (in diabetes-predictor/)
npm install
npm start
```

## API Endpoint

### POST /predict

Sends health data and receives diabetes risk prediction.

**Request:**
```json
{
  "HighBP": 1,
  "HighChol": 0,
  "CholCheck": 1,
  "BMI": 28.5,
  "Smoker": 0,
  "Stroke": 0,
  "HeartDiseaseorAttack": 0,
  "PhysActivity": 1,
  "HvyAlcoholConsump": 0,
  "AnyHealthcare": 1,
  "NoDocbcCost": 0,
  "GenHlth": 3,
  "MentHlth": 5,
  "PhysHlth": 0,
  "DiffWalk": 0,
  "Sex": 0,
  "Age": 6,
  "Education": 4,
  "Income": 5
}
```

**Response:**
```json
{
  "prediction": 1,
  "risk_probability": 65.5,
  "contributing_factors": ["High BMI", "Older Age"],
  "recommendations": ["Consider a weight loss plan..."]
}
```

## Model Details

The application uses a Random Forest classifier trained on health survey data. The model requires:
- Properly scaled input features (handled automatically)
- 19 health-related input features
- Outputs probability of diabetes risk (0-100%)

**Model file:** `app/model/random_forest_model_upsampled.joblib`  
**Scaler file:** `scaler.joblib`

## File Directory

### Frontend Components
- **Home.js** - Landing page
- **PredictionForm.js** - Main form for health data input (19 fields)
- **Results.js** - Risk prediction results display
- **BMICalculator.js** - Standalone BMI calculation tool
- **About.js** - Application information
- **Contact.js** - Contact page
- **Header.js** - Navigation header
- **Footer.js** - Page footer
- **RoutesComponent.js** - Route definitions

### Backend Files
- **run.py** - Flask application entry point
- **app/__init__.py** - Flask app initialization with CORS
- **app/routes.py** - API prediction endpoint & logic

### Configuration
- **requirements.txt** - Python dependencies
- **Procfile** - Heroku/cloud deployment config
- **package.json** - Node.js dependencies
- **Procfile** - Gunicorn web server config

## Contributing

This is a personal project. Feel free to fork and adapt for your needs.

## License

MIT License - Use freely for personal and educational projects.

## Support

For questions or issues, check the HOW_TO_RUN.md for detailed deployment guides.
