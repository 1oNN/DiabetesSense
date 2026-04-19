import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [bmi, setBmi] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const calculateBMI = () => {
    if (!weight || !heightFeet || !heightInches) {
      setError("Please fill in all fields before calculating BMI.");
      return;
    }

    const heightInMeters =
      (parseInt(heightFeet) * 12 + parseInt(heightInches)) * 0.0254;
    const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(
      2
    );
    setBmi(calculatedBmi);
    setError("");
  };

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi <= 24.9) return "Normal weight";
    if (bmi > 24.9 && bmi <= 29.9) return "Overweight";
    return "Obese";
  };

  const getBmiColor = (bmi) => {
    if (bmi < 18.5) return "yellow";
    if (bmi >= 18.5 && bmi <= 24.9) return "green";
    if (bmi > 24.9 && bmi <= 29.9) return "orange";
    return "red";
  };

  return (
    <div className="container bmi-container">
      <div className="content">
        <h1>BMI Calculator</h1>
        <div className="bmi-content">
          <div className="bmi-inputs">
            <div className="form-group">
              <label htmlFor="weight">Weight (kg):</label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="form-group height-group">
              <label>Height:</label>
              <div className="height-inputs">
                <input
                  type="number"
                  id="heightFeet"
                  placeholder="feet"
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(e.target.value)}
                />
                <input
                  type="number"
                  id="heightInches"
                  placeholder="inches"
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value)}
                />
              </div>
            </div>
            <div className="bmi-buttons">
              <button onClick={calculateBMI}>Calculate BMI</button>
              <button
                className="right-button"
                onClick={() => navigate("/predict")}
              >
                Back to Prediction Page
              </button>
            </div>
          </div>
          <div className="bmi-table">
            <h3>BMI Categories</h3>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>BMI Range</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ color: "yellow" }}>
                  <td>Underweight</td>
                  <td>&lt; 18.5</td>
                </tr>
                <tr style={{ color: "green" }}>
                  <td>Normal weight</td>
                  <td>18.5 - 24.9</td>
                </tr>
                <tr style={{ color: "orange" }}>
                  <td>Overweight</td>
                  <td>25 - 29.9</td>
                </tr>
                <tr style={{ color: "red" }}>
                  <td>Obese</td>
                  <td>&gt; 30</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        {bmi && (
          <div className="result">
            <h2>
              Your BMI:{" "}
              <span style={{ color: getBmiColor(bmi) }}>
                {bmi} ({getBmiCategory(bmi)})
              </span>
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default BMICalculator;
