import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container hero">
      <p className="hero-eyebrow">CDC BRFSS 2015 / 253,680 responses</p>

      <h1>Find out whether diabetes is worth testing for.</h1>

      <p className="hero-lede">
        Nineteen questions you can answer from memory. No blood draw, no lab,
        no appointment. About two minutes.
      </p>

      <div className="button-container">
        <button onClick={() => navigate("/predict")}>Start the screen</button>
        <button className="ghost" onClick={() => navigate("/about")}>
          How it works
        </button>
      </div>

      <dl className="hero-facts">
        <div className="hero-fact">
          <dt>Questions</dt>
          <dd>19</dd>
        </div>
        <div className="hero-fact">
          <dt>Blood tests</dt>
          <dd>0</dd>
        </div>
        <div className="hero-fact">
          <dt>Records trained on</dt>
          <dd>253,680</dd>
        </div>
        <div className="hero-fact">
          <dt>Models compared</dt>
          <dd>11</dd>
        </div>
      </dl>
    </div>
  );
}

export default Home;
