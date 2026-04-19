import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import PredictionForm from "./PredictionForm";
import Results from "./Results";
import BMICalculator from "./BMICalculator";

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/predict" element={<PredictionForm />} />
      <Route path="/results" element={<Results />} />
      <Route path="/bmi-calculator" element={<BMICalculator />} />
    </Routes>
  );
};

export default RoutesComponent;
