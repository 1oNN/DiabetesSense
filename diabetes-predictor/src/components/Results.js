import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};

  const openDoctorSearch = () => {
    window.open(
      "https://www.google.com/search?q=diabetes+doctors+near+me",
      "_blank"
    );
  };

  return (
    <div className="container result-container">
      <h1>Prediction Result</h1>
      <div className="result-content">
        <p style={{ fontSize: result?.prediction === 1 ? "1.1em" : "1em" }}>
          {result?.prediction === 1 ? (
            <>
              You already <span className="high-risk-text">Have Diabetes</span>{" "}
              or are at{" "}
              <span className="high-risk-text">High Risk of Diabetes.</span>
            </>
          ) : (
            "You do not currently have diabetes."
          )}
        </p>
        <p>
          {result?.prediction === 0 && (
            <>
              However, you are at{" "}
              <span className="risk-percentage">
                {result?.risk_probability.toFixed(2)}%
              </span>{" "}
              risk of developing diabetes in the future.
            </>
          )}
        </p>
        <h2>Contributing Factors</h2>
        <p>The following factors contributed to your results:</p>
        {result?.contributing_factors?.length > 0 ? (
          <ul>
            {result.contributing_factors.map((factor) => (
              <li key={factor}>{factor}</li>
            ))}
          </ul>
        ) : (
          <p>No contributing factors available.</p>
        )}
        <h2>Recommendations</h2>
        {result?.prediction === 1 && (
          <p>
            <strong>We suggest you see a doctor as soon as possible.</strong>
          </p>
        )}
        {result?.recommendations &&
          result.recommendations.map((recommendation, index) => (
            <div key={index}>
              <p>{recommendation}</p>
            </div>
          ))}
        {result?.prediction === 1 && (
          <div className="button-container">
            <button onClick={openDoctorSearch}>
              Search for Diabetes Doctors Near Me
            </button>
          </div>
        )}
        <div className="button-container">
          <button onClick={() => navigate("/predict")}>
            Predict Another Test
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
