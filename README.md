# Diabetes Risk Predictor

A web app that predicts diabetes risk based on health indicators. Uses a Random Forest model trained on BRFSS data and provides personalized health recommendations.

**The problem:** diabetes screening usually needs lab work - this asks 19 self-reportable
questions instead.
**The approach:** 11 classifiers benchmarked on BRFSS 2015 (253,680 CDC records); the 86/14
class imbalance handled with random over-sampling, chosen over SMOTE/ADASYN after a
head-to-head comparison.
**The result:** Random Forest at 93.15% accuracy, 98.4% sensitivity - served by
this Flask API + React front end.

**Full case study:** https://hammadahmad.co.uk/projects/diabetes-risk

## Features

- Diabetes risk prediction with probability scoring
- Identifies contributing health factors
- Personalized health recommendations
- BMI calculator
- Works on mobile and desktop

## Quick Start

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

## Deployment

### Heroku
```bash
git push heroku main
```

### Docker
```bash
docker build -t diabetes-predictor .
docker-compose up -d
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for more options.

## Project Structure

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

## ML Model

- **Algorithm**: Random Forest Classifier
- **Training Data**: Behavioral Risk Factor Surveillance System (BRFSS) 2015
- **Features**: 21 health indicators (blood pressure, cholesterol, BMI, physical activity, etc.)
- **Balancing**: Random over-sampling to even out the class distribution
- **Performance**: 93% accuracy on the test split

## API

POST `/predict` - Submit health data and get diabetes risk prediction

Response includes risk probability, contributing factors, and recommendations.

## Testing

```bash
pytest tests/          # Backend
npm test              # Frontend (in diabetes-predictor/)
```

## Important

- For educational and demo purposes only
- Not a substitute for medical advice
- No user data is stored
- Consult healthcare professionals for real concerns

## Documentation

For detailed technical information, see [HOW_IT_WORKS.md](HOW_IT_WORKS.md).

## License

MIT

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Support

For questions or issues, please open an issue on GitHub or contact us through the app's contact page.

## Acknowledgments

- BRFSS Dataset: CDC's Behavioral Risk Factor Surveillance System
- React: UI framework
- Flask: Backend framework
- scikit-learn: Machine learning library

