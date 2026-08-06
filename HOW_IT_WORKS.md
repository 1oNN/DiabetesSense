# How It Works

## 🏗️ Architecture Overview

The Diabetes Risk Predictor is a full-stack web application with a clear separation between frontend and backend:

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    React Frontend                          │ │
│  │  (localhost:3000)                                          │ │
│  │                                                            │ │
│  │  • Home Page                                               │ │
│  │  • Prediction Form (collects health data)                 │ │
│  │  • BMI Calculator                                         │ │
│  │  • Results Display                                        │ │
│  │  • About & Contact Pages                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│           ↕ (HTTP/JSON)                                         │
└─────────────────────────────────────────────────────────────────┘
                          |
                   CORS Enabled
                          |
         ┌────────────────↓───────────────────┐
         │                                    │
    ┌────▼─────────────────────────────────┐ │
    │      Flask Backend Server            │ │
    │    (localhost:5000)                  │ │
    │                                      │ │
    │  ┌────────────────────────────────┐ │ │
    │  │   API Routes                   │ │ │
    │  │ - POST /predict                │ │ │
    │  └────────────────────────────────┘ │ │
    │           ↓                          │ │
    │  ┌────────────────────────────────┐ │ │
    │  │  Data Processing               │ │ │
    │  │ - Input validation             │ │ │
    │  │ - Feature scaling              │ │ │
    │  │ - Contributing factors         │ │ │
    │  │ - Recommendations generation   │ │ │
    │  └────────────────────────────────┘ │ │
    │           ↓                          │ │
    │  ┌────────────────────────────────┐ │ │
    │  │  Prediction Model              │ │ │
    │  │ - Random Forest Classifier     │ │ │
    │  │ - Probability calculation      │ │ │
    │  └────────────────────────────────┘ │ │
    └────────────────────────────────────┘ │
         └────────────────────────────────┘
```

## 📱 Frontend (React)

### Technology Stack
- **Framework**: React 18.3
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS + SASS
- **Build Tool**: Create React App

### Component Structure

```
App.js (Root)
├── Header.js
├── RoutesComponent.js
│   ├── Home.js
│   ├── PredictionForm.js
│   │   ├── Form Input Fields
│   │   └── Submit Button
│   ├── Results.js
│   │   ├── Risk Probability Display
│   │   ├── Contributing Factors List
│   │   └── Recommendations
│   ├── BMICalculator.js
│   ├── About.js
│   └── Contact.js
└── Footer.js
```

### User Flow

```
1. User visits app
                ↓
2. Browses Home/About/Contact
                ↓
3. Fills in Prediction Form
   (21 health indicators)
                ↓
4. Submits form
   (POST request to /predict)
                ↓
5. Receives predictions
   (displayed in Results component)
                ↓
6. Reviews risk probability
   and recommendations
```

## 🖥️ Backend (Flask)

### Technology Stack
- **Framework**: Flask
- **CORS**: Flask-CORS
- **Server**: Gunicorn (production)
- **ML Library**: scikit-learn
- **Data Processing**: NumPy
- **Model Serialization**: joblib

### Core Components

#### 1. **App Factory** (`app/__init__.py`)
```python
def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable cross-origin requests
    app.register_blueprint(main)  # Register routes
    return app
```
- Creates Flask application instance
- Enables CORS for frontend communication
- Registers API blueprints

#### 2. **Routes** (`app/routes.py`)

**Endpoint**: `POST /predict`

**Workflow**:
```
1. Receive JSON data from frontend
   (21 health indicators)
                ↓
2. Validate input data
                ↓
3. Convert to NumPy array
   (reshape to 1 x 21)
                ↓
4. Apply feature scaling
   (using pre-trained scaler)
                ↓
5. Make prediction with Random Forest model
   - Get class prediction (0 or 1)
   - Get probability scores
                ↓
6. Calculate risk probability
   (probability of class 1 * 100)
                ↓
7. Identify contributing factors
   - Check which health indicators are "problematic"
                ↓
8. Generate personalized recommendations
   - Based on contributing factors
                ↓
9. Return JSON response
   {
     prediction: 0 or 1,
     risk_probability: float,
     contributing_factors: list,
     recommendations: list
   }
```

#### 3. **Model Loading**
```python
# On startup
random_forest_model = joblib.load('app/model/random_forest_model_upsampled.joblib')
scaler = joblib.load('scaler.joblib')
```
- Models are loaded once at startup
- Joblib provides efficient serialization for scikit-learn objects

### Health Indicators (Input Features)

The model accepts 21 health indicators:

1. **HighBP** - High blood pressure (0/1)
2. **HighChol** - High cholesterol (0/1)
3. **CholCheck** - Cholesterol check in last 5 years (0/1)
4. **BMI** - Body Mass Index (numeric, typically 12-98)
5. **Smoker** - Current smoker (0/1)
6. **Stroke** - History of stroke (0/1)
7. **HeartDiseaseorAttack** - Coronary heart disease/MI (0/1)
8. **PhysActivity** - Physical activity in past 30 days (0/1)
9. **Fruits** - Consume fruits 1+ times daily (0/1)
10. **Veggies** - Consume vegetables 1+ times daily (0/1)
11. **HvyAlcoholConsump** - Heavy alcohol consumption (0/1)
12. **AnyHealthcare** - Has any healthcare coverage (0/1)
13. **NoDocbcCost** - Could not see doctor due to cost (0/1)
14. **GenHlth** - General health rating (1-5, 1=excellent, 5=poor)
15. **MentHlth** - Days mental health not good (0-30)
16. **PhysHlth** - Days physical health not good (0-30)
17. **DiffWalk** - Difficulty walking/climbing stairs (0/1)
18. **Sex** - Sex (0=female, 1=male)
19. **Age** - Age group (18-24=1, 25-29=2, ..., 80 or older=13)
20. **Education** - Education level (1-6, 1=never attended, 6=college graduate)
21. **Income** - Income level (1-8, 1=<$10k, 8=$75k or more)

### Contributing Factors Logic

The system identifies problematic indicators:
- **High Blood Pressure**: `HighBP == 1`
- **High Cholesterol**: `HighChol == 1`
- **High BMI**: `BMI > 30`
- **Lack of Physical Activity**: `PhysActivity == 0`
- **Older Age**: `Age > 45` (approximately 55+ years)
- **Poor General Health**: `GenHlth >= 4`

### Recommendations Generation

Each contributing factor triggers specific recommendations:
- High BP → Monitor through diet and medication
- High Cholesterol → Dietary changes and medication
- High BMI → Weight loss plan with diet and exercise
- No Physical Activity → Increase activity for weight/insulin
- Older Age → Maintain healthy lifestyle, regular check-ups
- Poor Health → Balanced diet, exercise, medical check-ups

## 📊 Prediction Model

### Model Details

**Type**: Random Forest Classifier
- Ensemble of decision trees
- Reduces overfitting
- Provides probability estimates

**Training Data**: BRFSS 2015
- Dataset files in `diabetes_dataset/`
  - `diabetes_012_health_indicators_BRFSS2015.csv`
  - `diabetes_binary_health_indicators_BRFSS2015.csv`
  - `diabetes_binary_5050split_health_indicators_BRFSS2015.csv`
- Random over-sampling used to even out the class distribution

**Performance**: 93% accuracy on the test split
- Evaluated on a 20% split of the over-sampled data
- Sensitivity and specificity both above 87%

### Feature Scaling

**Scaler Type**: StandardScaler (scikit-learn)
- Loaded from `scaler.joblib`
- Applied before prediction
- Transforms input to mean=0, std=1
- Critical for model accuracy

## 🔄 Data Flow Example

### Scenario: User submits diabetes risk form

```
Frontend                          Backend
────────                          ────────

User fills form
      ↓
Click "Predict"
      ↓
Collect form data
      ↓
Send POST /predict
with JSON body
      ↓                           Receive request
      ↓───────────────────────→   ↓
                                  Parse JSON
                                  ↓
                                  Convert to numpy array
                                  ↓
                                  Scale features
                                  ↓
                                  Run Random Forest model
                                  ↓
                                  Extract prediction (0/1)
                                  ↓
                                  Calculate probability
                                  ↓
                                  Identify contributing factors
                                  ↓
                                  Generate recommendations
                                  ↓
                                  Create response JSON
      ←───────────────────────   Send response
      ↓
Receive response
      ↓
Parse JSON
      ↓
Update Results component
      ↓
Display to user:
- Risk probability
- Contributing factors
- Recommendations
```

## 🚀 Deployment Considerations

### Local Development
```bash
# Terminal 1 - Backend
python run.py
# Runs on http://localhost:5000

# Terminal 2 - Frontend
cd diabetes-predictor && npm start
# Runs on http://localhost:3000
```

### Production
```bash
# Frontend: Build static assets
cd diabetes-predictor && npm run build

# Backend: Use Gunicorn
gunicorn run:app
```

### Environment Variables
- `FLASK_ENV`: Set to 'production'
- `FLASK_DEBUG`: Set to 'False'
- `CORS_ORIGINS`: Configure for specific domains

## 📊 Performance Notes

### Model Predictions
- Prediction latency: ~10-50ms per request
- Model size: ~100MB (joblib file)
- Memory footprint: Low (scikit-learn RandomForest)

### Frontend
- React app size: ~200KB (gzipped)
- Initial load: Typically <2 seconds

### Scalability
- Stateless backend (no sessions/database)
- Can be horizontally scaled
- Use load balancer for multiple instances
- Consider caching if high traffic

## 🔒 Security Considerations

### Input Validation
- Health indicators are validated on backend
- Type checking for numeric fields
- Range validation could be added

### Data Privacy
- No data is stored in database
- Requests are processed and discarded
- No logging of sensitive health data
- Use HTTPS in production

### CORS
- Currently open for development
- Should restrict to specific domains in production

## 🐛 Debugging

### Backend Debugging
```python
# Add to routes.py for debugging
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Frontend Debugging
- React DevTools browser extension
- Network tab in browser DevTools
- Console logs for component state

### Common Issues
1. **Model not found**: Ensure `app/model/random_forest_model_upsampled.joblib` exists
2. **Scaler not found**: Ensure `scaler.joblib` exists in root directory
3. **CORS errors**: Check Flask-CORS configuration
4. **Port already in use**: Change port or kill existing process

## 📚 Further Reading

- [Random Forest Documentation](https://scikit-learn.org/stable/modules/ensemble.html#random-forests)
- [React Documentation](https://react.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [BRFSS Survey](https://www.cdc.gov/brfss/index.html)

---

**Last Updated**: 2026-04-21
