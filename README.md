# Diabetes Risk Predictor

A full-stack web application that predicts the risk of diabetes using machine learning. The app analyzes health indicators from the BRFSS dataset and provides personalized health recommendations.

## 🎯 Features

- **Machine Learning Predictions**: Uses a Random Forest model trained on BRFSS health indicators data
- **Risk Probability**: Calculates the likelihood of diabetes risk with confidence scoring
- **Contributing Factors**: Identifies which health metrics contribute to the risk
- **Personalized Recommendations**: Provides actionable health recommendations based on user data
- **BMI Calculator**: Built-in calculator for body mass index computation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Interactive UI**: React-based interface with real-time form validation

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+) and npm
- Python (v3.8+)
- pip

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd diabetes_app
   ```

2. **Set up the Backend**
   ```bash
   # Install Python dependencies
   pip install -r requirements.txt
   ```

3. **Set up the Frontend**
   ```bash
   cd diabetes-predictor
   npm install
   cd ..
   ```

### Development

**Run the Flask backend** (from project root):
```bash
python run.py
```
The API will be available at `http://localhost:5000`

**Run the React frontend** (in another terminal, from `diabetes-predictor` directory):
```bash
npm start
```
The app will open at `http://localhost:3000`

## 📦 Production Deployment

### Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create and Deploy**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

3. **Build Frontend for Production**
   The `Procfile` will handle backend startup. For frontend, the build should be included in the deployment.

### Docker Deployment

A `Dockerfile` can be created for containerized deployment:

```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "run:app"]
```

### Environment Variables

Create a `.env` file in the root directory (for development):
```
FLASK_ENV=production
FLASK_DEBUG=False
```

## 📊 Project Structure

```
diabetes_app/
├── app/
│   ├── __init__.py              # Flask app factory
│   ├── routes.py                # API endpoints (/predict)
│   └── model/
│       └── random_forest_model_upsampled.joblib  # Trained ML model
├── diabetes-predictor/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js
│   │   │   ├── PredictionForm.js
│   │   │   ├── Results.js
│   │   │   ├── BMICalculator.js
│   │   │   ├── About.js
│   │   │   ├── Contact.js
│   │   │   └── Header.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── diabetes_dataset/            # Training data (BRFSS)
├── scaler.joblib                # Feature scaler
├── requirements.txt             # Python dependencies
├── Procfile                      # Heroku deployment config
└── run.py                        # Entry point
```

## 🤖 ML Model

- **Algorithm**: Random Forest Classifier
- **Training Data**: Behavioral Risk Factor Surveillance System (BRFSS) 2015
- **Features**: 21 health indicators (blood pressure, cholesterol, BMI, physical activity, etc.)
- **Performance**: Trained on balanced dataset using upsampling technique

## 📡 API Endpoints

### POST `/predict`

Predicts diabetes risk based on health indicators.

**Request Body:**
```json
{
  "HighBP": 1,
  "HighChol": 1,
  "CholCheck": 1,
  "BMI": 32,
  "Smoker": 0,
  "Stroke": 0,
  "HeartDiseaseorAttack": 0,
  "PhysActivity": 1,
  "Fruits": 1,
  "Veggies": 1,
  "HvyAlcoholConsump": 0,
  "AnyHealthcare": 1,
  "NoDocbcCost": 0,
  "GenHlth": 4,
  "MentHlth": 0,
  "PhysHlth": 0,
  "DiffWalk": 0,
  "Sex": 0,
  "Age": 55,
  "Education": 4,
  "Income": 8
}
```

**Response:**
```json
{
  "prediction": 1,
  "risk_probability": 72.5,
  "contributing_factors": [
    "High Blood Pressure",
    "High Cholesterol",
    "High BMI"
  ],
  "recommendations": [
    "Monitor and manage your blood pressure through diet and medication.",
    "Consider dietary changes and medication to manage cholesterol.",
    "Consider a weight loss plan that includes diet and exercise to reduce your BMI."
  ]
}
```

## 🧪 Testing

**Backend Tests** (create `tests/` directory):
```bash
pytest tests/
```

**Frontend Tests**:
```bash
cd diabetes-predictor
npm test
```

## ⚠️ Important Notes

- The model is for educational and demonstration purposes only
- This is not a substitute for professional medical advice
- Always consult with healthcare professionals for actual medical concerns
- User data is not stored or persisted
- CORS is enabled for local development but should be configured for production

## 🔐 Security

- Input validation is performed on health indicators
- Model files are loaded safely using joblib
- CORS headers are configured appropriately
- Flask debug mode is disabled in production

## 📚 Documentation

For detailed technical information, see [HOW_IT_WORKS.md](HOW_IT_WORKS.md).

## 📝 License

[Specify your license here - e.g., MIT, Apache 2.0]

## 👥 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For questions or issues, please open an issue on GitHub or contact us through the app's contact page.

## 🙏 Acknowledgments

- BRFSS Dataset: CDC's Behavioral Risk Factor Surveillance System
- React: UI framework
- Flask: Backend framework
- scikit-learn: Machine learning library

---

**Last Updated**: 2026-04-21
