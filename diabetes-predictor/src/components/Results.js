import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

/* Diabetes rate across the full BRFSS 2015 cohort, marked on the gauge. */
const POPULATION_RATE = 13.9;

const RECEIPT = [
  ["HighBP", "High blood pressure", (v) => (v ? "Yes" : "No")],
  ["HighChol", "High cholesterol", (v) => (v ? "Yes" : "No")],
  ["BMI", "Body mass index", (v) => Number(v).toFixed(1)],
  ["GenHlth", "General health", (v) =>
    ["", "Excellent", "Very good", "Good", "Fair", "Poor"][v] || "-"],
  ["Age", "Age band", (v) =>
    ["", "18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54",
     "55-59", "60-64", "65-69", "70-74", "75-79", "80+"][v] || "-"],
  ["PhysActivity", "Active in the past month", (v) => (v ? "Yes" : "No")],
  ["Smoker", "Smoked 100+ cigarettes", (v) => (v ? "Yes" : "No")],
  ["DiffWalk", "Difficulty walking", (v) => (v ? "Yes" : "No")],
  ["PhysHlth", "Poor physical-health days", (v) => `${v}`],
  ["MentHlth", "Poor mental-health days", (v) => `${v}`],
];

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, answers } = location.state || {};

  if (!result) {
    return (
      <div className="container">
        <div className="result-shell">
          <h1>No result to show</h1>
          <p>Answer the nineteen questions and the screen will appear here.</p>
          <div className="button-container">
            <button onClick={() => navigate("/predict")}>
              Start the screen
            </button>
          </div>
        </div>
      </div>
    );
  }

  const risk = Number(result.risk_probability) || 0;
  const positive = result.prediction === 1;
  const factors = result.contributing_factors || [];
  const advice = result.recommendations || [];

  return (
    <div className="container">
      <div className="result-shell">
        <p className="result-eyebrow">Screening result</p>

        <div className="result-figure">{risk.toFixed(1)}%</div>
        <p className="result-verdict">
          {positive
            ? "Your answers match the pattern the model associates with diabetes."
            : "Your answers do not match the pattern the model associates with diabetes."}
        </p>

        <div className="gauge">
          <div className="gauge-track">
            <div className="gauge-fill" style={{ width: `${Math.min(risk, 100)}%` }} />
            <div
              className="gauge-baseline"
              style={{ left: `${POPULATION_RATE}%` }}
              title="Population rate"
            />
          </div>
          <div className="gauge-legend">
            <span>
              <span className="mono">{POPULATION_RATE}%</span> of US adults in
              this survey had diabetes
            </span>
            <span>
              <span className="mono">{risk.toFixed(1)}%</span> for your answers
            </span>
          </div>
        </div>

        {positive && (
          <div className="result-section">
            <div className="callout">
              A positive screen is not a diagnosis. It means a blood test is
              worth booking with your doctor.
            </div>
            <div className="button-container">
              <button
                onClick={() =>
                  window.open(
                    "https://www.google.com/search?q=diabetes+doctors+near+me",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                Find a doctor nearby
              </button>
            </div>
          </div>
        )}

        {factors.length > 0 && (
          <div className="result-section">
            <h2>What drove it</h2>
            <ul className="factor-list">
              {factors.map((factor, i) => (
                <li className="factor" key={factor}>
                  <span className="factor-rank">{i + 1}</span>
                  <span className="factor-name">{factor}</span>
                  <span
                    className="factor-bar"
                    style={{ opacity: 0.85 - i * 0.12 }}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {advice.length > 0 && (
          <div className="result-section">
            <h2>What you can do</h2>
            <ul className="advice-list">
              {advice.map((line) => (
                <li className="advice" key={line}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}

        {answers && (
          <div className="result-section">
            <h2>What you told us</h2>
            <ul className="receipt">
              {RECEIPT.map(([key, label, fmt]) => (
                <li key={key}>
                  {label}
                  <span>{fmt(answers[key])}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="disclaimer">
          This is a screening tool built on self-reported survey data, not a
          medical device. It cannot diagnose anything. Nothing you entered was
          stored.
        </p>

        <div className="result-section">
          <div className="button-container">
            <button className="ghost" onClick={() => navigate("/predict")}>
              Take it again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
