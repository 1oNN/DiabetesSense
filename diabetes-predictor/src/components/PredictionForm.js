import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

function PredictionForm() {
  const [formData, setFormData] = useState({
    HighBP: 0,
    HighChol: 0,
    CholCheck: 0,
    BMI: 25.0,
    Smoker: 0,
    Stroke: 0,
    HeartDiseaseorAttack: 0,
    PhysActivity: 0,
    HvyAlcoholConsump: 0,
    AnyHealthcare: 0,
    NoDocbcCost: 0,
    GenHlth: 3,
    MentHlth: 0,
    PhysHlth: 0,
    DiffWalk: 0,
    Sex: 0,
    Age: 1,
    Education: 1,
    Income: 1,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const validateForm = () => {
    let formErrors = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] === "" || formData[key] === null) {
        formErrors[key] = "This field is required";
      }
    });
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/predict`,
          formData
        );
        navigate("/results", { state: { result: response.data } });
      } catch (error) {
        console.error("Error making prediction", error);
      }
    }
  };

  return (
    <div className="container prediction-form-container">
      <h1>Predict Your Diabetes Risk</h1>
      <form className="prediction-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="HighBP">Do you have high blood pressure?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="HighBP"
                value="1"
                checked={formData.HighBP === 1}
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="HighBP"
                value="0"
                checked={formData.HighBP === 0}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="HighChol">Do you have high cholesterol?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="HighChol"
                value="1"
                checked={formData.HighChol === 1}
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="HighChol"
                value="0"
                checked={formData.HighChol === 0}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="CholCheck">
            Have you checked your cholesterol in the last 5 years?
          </label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="CholCheck"
                value="1"
                checked={formData.CholCheck === 1}
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="CholCheck"
                value="0"
                checked={formData.CholCheck === 0}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="BMI">
            What is your Body Mass Index (BMI)?{" "}
            <Link to="/bmi-calculator" className="bmi-link">
              Calculate your BMI
            </Link>
          </label>
          <input
            type="number"
            name="BMI"
            value={formData.BMI}
            onChange={handleChange}
            min="10"
            max="50"
            step="0.1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="Smoker">
            Have you smoked over 100 cigarettes in your lifetime?
          </label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="Smoker"
                value="1"
                checked={formData.Smoker === 1}
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="Smoker"
                value="0"
                checked={formData.Smoker === 0}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="Stroke">Have you ever had a stroke?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="Stroke"
                value="1"
                checked={formData.Stroke === 1}
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="Stroke"
                value="0"
                checked={formData.Stroke === 0}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="HeartDiseaseorAttack">
            Have you ever had heart disease or a heart attack?
          </label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="HeartDiseaseorAttack"
                value="1"
                checked={formData.HeartDiseaseorAttack === 1}
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="HeartDiseaseorAttack"
                value="0"
                checked={formData.HeartDiseaseorAttack === 0}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="PhysActivity">
            Do you regularly engage in physical activity?
          </label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="PhysActivity"
                value="1"
                checked={formData.PhysActivity === 1}
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="PhysActivity"
                value="0"
                checked={formData.PhysActivity === 0}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="HvyAlcoholConsump">
            Do you consume alcohol heavily?
          </label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="HvyAlcoholConsump"
                value="1"
                checked={formData.HvyAlcoholConsump === 1}
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="HvyAlcoholConsump"
                value="0"
                checked={formData.HvyAlcoholConsump === 0}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="AnyHealthcare">
            Do you have any healthcare coverage?
          </label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="AnyHealthcare"
                value="1"
                checked={formData.AnyHealthcare === 1}
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="AnyHealthcare"
                value="0"
                checked={formData.AnyHealthcare === 0}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="NoDocbcCost">
            Have you ever needed to see a doctor but could not due to cost?
          </label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="NoDocbcCost"
                value="1"
                checked={formData.NoDocbcCost === 1}
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="NoDocbcCost"
                value="0"
                checked={formData.NoDocbcCost === 0}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="GenHlth">
            How would you rate your general health?
          </label>
          <select
            name="GenHlth"
            value={formData.GenHlth}
            onChange={handleChange}
          >
            <option value="1">Excellent</option>
            <option value="2">Very Good</option>
            <option value="3">Good</option>
            <option value="4">Fair</option>
            <option value="5">Poor</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="MentHlth">
            How many days has your mental health not been good in the past
            month?
          </label>
          <input
            type="number"
            name="MentHlth"
            value={formData.MentHlth}
            onChange={handleChange}
            min="0"
            max="30"
          />
        </div>
        <div className="form-group">
          <label htmlFor="PhysHlth">
            How many days has your physical health not been good in the past
            month?
          </label>
          <input
            type="number"
            name="PhysHlth"
            value={formData.PhysHlth}
            onChange={handleChange}
            min="0"
            max="30"
          />
        </div>
        <div className="form-group">
          <label htmlFor="DiffWalk">
            Do you have difficulty walking or climbing stairs?
          </label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="DiffWalk"
                value="1"
                checked={formData.DiffWalk === 1}
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="DiffWalk"
                value="0"
                checked={formData.DiffWalk === 0}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="Sex">What is your gender?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="Sex"
                value="1"
                checked={formData.Sex === 1}
                onChange={handleChange}
              />{" "}
              Male
            </label>
            <label>
              <input
                type="radio"
                name="Sex"
                value="0"
                checked={formData.Sex === 0}
                onChange={handleChange}
              />{" "}
              Female
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="Age">What is your age?</label>
          <select name="Age" value={formData.Age} onChange={handleChange}>
            <option value="1">18-24</option>
            <option value="2">25-29</option>
            <option value="3">30-34</option>
            <option value="4">35-39</option>
            <option value="5">40-44</option>
            <option value="6">45-49</option>
            <option value="7">50-54</option>
            <option value="8">55-59</option>
            <option value="9">60-64</option>
            <option value="10">65-69</option>
            <option value="11">70-74</option>
            <option value="12">75-79</option>
            <option value="13">80+</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="Education">
            What is the highest level of education you have completed?
          </label>
          <select
            name="Education"
            value={formData.Education}
            onChange={handleChange}
          >
            <option value="1">Never attended school</option>
            <option value="2">Elementary school</option>
            <option value="3">Some high school</option>
            <option value="4">High school graduate</option>
            <option value="5">Some college</option>
            <option value="6">College graduate</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="Income">What is your income category?</label>
          <select name="Income" value={formData.Income} onChange={handleChange}>
            <option value="1">$10,000 or less</option>
            <option value="2">$10,000 to $15,000</option>
            <option value="3">$15,000 to $20,000</option>
            <option value="4">$20,000 to $25,000</option>
            <option value="5">$25,000 to $35,000</option>
            <option value="6">$35,000 to $50,000</option>
            <option value="7">$50,000 to $75,000</option>
            <option value="8">$75,000 or more</option>
          </select>
        </div>
        <button type="submit">Predict</button>
        {Object.keys(errors).map((key) => (
          <p key={key} className="error">
            {errors[key]}
          </p>
        ))}
      </form>
    </div>
  );
}

export default PredictionForm;
