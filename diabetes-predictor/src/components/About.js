import React from "react";
import "../App.css";

function About() {
  return (
    <div className="container">
      <h1>How it works</h1>
      <p className="hero-lede">
        DiabetesSense estimates the risk of diabetes from nineteen questions you
        can answer without a lab, a needle, or an appointment.
      </p>

      <h2>Where the model comes from</h2>
      <p>
        It was trained on the CDC Behavioral Risk Factor Surveillance System
        survey for 2015, which is 253,680 responses. Eleven classifier families
        were benchmarked against each other on the same split, from logistic
        regression through to gradient-boosted ensembles. A Random Forest of 100
        trees won, reaching 93.15% accuracy on the held-out data.
      </p>

      <h2>What the questions are for</h2>
      <p>
        The survey records 21 health indicators. Two of them, on fruit and
        vegetable intake, are left out, so nineteen remain. They cover measured
        vitals, past cardiac events, how the last month has been, and background
        including whether care is affordable. Income and education both correlate
        with the outcome, which is why they are asked.
      </p>

      <h2>What the result means</h2>
      <p>
        You get a probability, the answers that drove it, and a comparison
        against the rate of diabetes in the survey population, which was 13.9%.
        A high number is a reason to book a blood test. It is not a diagnosis,
        and this is not a medical device.
      </p>

      <h2>Privacy</h2>
      <p>
        Answers are sent to the model, scored, and returned. Nothing is written
        to a database and nothing is logged.
      </p>

      <h2>Who built it</h2>
      <p>
        Hammad Ahmad and Inshra Javed, with Dr Maleeha Azem and Dr M. Umar Khan.
        <br />
        Department of Biosciences, COMSATS University Islamabad.
        <br />
        Department of Electrical and Computer Engineering, CUI Islamabad.
      </p>
    </div>
  );
}

export default About;
