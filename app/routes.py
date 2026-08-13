from flask import Blueprint, request, jsonify
import numpy as np
import joblib
import os

main = Blueprint('main', __name__)

# Load the trained model
model_path = 'app/model/random_forest_model_upsampled.joblib'

if os.path.exists(model_path):
    random_forest_model = joblib.load(model_path)
else:
    random_forest_model = None

# The order the model was trained in. Fruits and Veggies are deliberately absent -
# they are dropped before training, leaving 19 of the 21 BRFSS indicators.
FEATURE_ORDER = [
    'HighBP', 'HighChol', 'CholCheck', 'BMI', 'Smoker', 'Stroke',
    'HeartDiseaseorAttack', 'PhysActivity', 'HvyAlcoholConsump', 'AnyHealthcare',
    'NoDocbcCost', 'GenHlth', 'MentHlth', 'PhysHlth', 'DiffWalk', 'Sex',
    'Age', 'Education', 'Income',
]

def get_contributing_factors(data):
    contributing_factors = []
    if data['HighBP'] == 1:
        contributing_factors.append('High Blood Pressure')
    if data['HighChol'] == 1:
        contributing_factors.append('High Cholesterol')
    if data['BMI'] > 30:
        contributing_factors.append('High BMI')
    if data['PhysActivity'] == 0:
        contributing_factors.append('Lack of Physical Activity')
    if data['Age'] > 45:
        contributing_factors.append('Older Age')
    if data['GenHlth'] >= 4:
        contributing_factors.append('Poor General Health')
    return contributing_factors

def get_recommendations(data, contributing_factors):
    recommendations = []
    for factor in contributing_factors:
        if factor == 'High Blood Pressure':
            recommendations.append("Monitor and manage your blood pressure through diet and medication.")
        elif factor == 'High Cholesterol':
            recommendations.append("Consider dietary changes and medication to manage cholesterol.")
        elif factor == 'High BMI':
            recommendations.append("Consider a weight loss plan that includes diet and exercise to reduce your BMI.")
        elif factor == 'Lack of Physical Activity':
            recommendations.append("Increasing physical activity can help reduce weight and improve insulin sensitivity.")
        elif factor == 'Older Age':
            recommendations.append("Age is a non-modifiable risk factor. It's important to maintain a healthy lifestyle and have regular check-ups.")
        elif factor == 'Poor General Health':
            recommendations.append("Improving your general health through a balanced diet, regular exercise, and regular medical check-ups is crucial.")
    return recommendations

@main.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': random_forest_model is not None
    }), 200

@main.route('/predict', methods=['POST'])
def predict():
    if random_forest_model is None:
        return jsonify({'error': 'Model files not loaded. Please ensure model files are in place.'}), 500

    data = request.json or {}

    missing = [name for name in FEATURE_ORDER if name not in data]
    if missing:
        return jsonify({'error': 'Missing required fields', 'missing': missing}), 400

    # Build the vector by name, not by dict order - a client that sends the same
    # answers in a different order must get the same prediction.
    input_data = np.array([data[name] for name in FEATURE_ORDER], dtype=float).reshape(1, -1)

    # No scaling: the forest was trained on raw indicator values, so its split
    # thresholds are in raw units (BMI in kg/m2, Age as a 1-13 band, and so on).
    prediction = random_forest_model.predict(input_data)
    prediction_probabilities = random_forest_model.predict_proba(input_data)
    risk_probability = prediction_probabilities[0][1] * 100  # Probability of being at high risk

    # Get contributing factors
    contributing_factors = get_contributing_factors(data)
    recommendations = get_recommendations(data, contributing_factors)

    return jsonify({
        'prediction': int(prediction[0]),
        'risk_probability': risk_probability,
        'contributing_factors': contributing_factors,
        'recommendations': recommendations
    })
