import React from "react";
import "../App.css";

function About() {
  return (
    <div className="container">
      <h1>About Us</h1>
      <p>
        The Diabetes Predictor App is a tool developed to help individuals
        assess their risk of developing diabetes. It uses a machine learning
        model trained on a large dataset of health indicators.
      </p>

      <h2>Our Goal</h2>
      <p>
        Our goal is to provide a user-friendly and accurate risk assessment tool
        that can help users take proactive steps in managing their health.
      </p>

      <h2>How We Calculate Results</h2>
      <p>
        Our prediction model uses a Random Forest algorithm, which is trained on
        a comprehensive dataset of various health indicators. When you input
        your health data, the model analyzes it and predicts your risk of
        diabetes based on the patterns it has learned from the training data.
      </p>

      <h2>Model Accuracy</h2>
      <p>
        We used a Random Forest model which has achieved an accuracy of{" "}
        <strong style={{ color: "green" }}>93%</strong> on our test dataset.
        This high accuracy ensures that the predictions are reliable and can be
        used to take informed steps towards better health management.
      </p>

      <h2>Created by</h2>
      <p>
        Hammad Ahmad, Inshra Javed, Dr. Maleeha Azem & Dr. M. Umar Khan
        <br />
        Department of Biosciences, Comsats University Islamabad
        <br />
        Department of Electrical and Computer Engineering, CUI, Islamabad
      </p>
    </div>
  );
}

export default About;
