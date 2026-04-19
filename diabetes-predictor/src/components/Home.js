import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  const handlePredictClick = () => {
    navigate("/predict");
  };

  return (
    <div className="container">
      <h1>Welcome to PreDiab</h1>
      <p>
        Use this app to check your risk of diabetes. Enter your health
        indicators, and we'll predict your risk based on our advanced machine
        learning model.
      </p>

      <button onClick={handlePredictClick}>Predict Your Risk</button>
    </div>
  );
}

export default Home;
