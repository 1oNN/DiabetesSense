import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

/* The nineteen indicators the model was trained on, in its own order.
   Grouped into four steps by what is actually being asked: measurements,
   past events, how the last month has been, and background. */

const YES_NO = [
  [1, "Yes"],
  [0, "No"],
];

const FIELDS = {
  HighBP: { q: "Do you have high blood pressure?", type: "choice", options: YES_NO },
  HighChol: { q: "Do you have high cholesterol?", type: "choice", options: YES_NO },
  CholCheck: {
    q: "Have you had your cholesterol checked in the last five years?",
    type: "choice",
    options: YES_NO,
  },
  BMI: {
    q: "What is your body mass index?",
    type: "number",
    min: 10,
    max: 50,
    step: 0.1,
    bmiLink: true,
  },
  Smoker: {
    q: "Have you smoked at least 100 cigarettes in your life?",
    type: "choice",
    options: YES_NO,
    hint: "About five packs, in total, ever.",
  },
  Stroke: { q: "Have you ever had a stroke?", type: "choice", options: YES_NO },
  HeartDiseaseorAttack: {
    q: "Have you ever had heart disease or a heart attack?",
    type: "choice",
    options: YES_NO,
  },
  HvyAlcoholConsump: {
    q: "Do you drink heavily?",
    type: "choice",
    options: YES_NO,
    hint: "More than 14 drinks a week for men, more than 7 for women.",
  },
  PhysActivity: {
    q: "Have you done any physical activity in the past month?",
    type: "choice",
    options: YES_NO,
    hint: "Anything outside of your job counts.",
  },
  GenHlth: {
    q: "How would you rate your general health?",
    type: "select",
    options: [
      [1, "Excellent"],
      [2, "Very good"],
      [3, "Good"],
      [4, "Fair"],
      [5, "Poor"],
    ],
  },
  MentHlth: {
    q: "How many days in the past month was your mental health not good?",
    type: "number",
    min: 0,
    max: 30,
    step: 1,
    hint: "0 to 30 days.",
  },
  PhysHlth: {
    q: "How many days in the past month was your physical health not good?",
    type: "number",
    min: 0,
    max: 30,
    step: 1,
    hint: "0 to 30 days.",
  },
  DiffWalk: {
    q: "Do you have difficulty walking or climbing stairs?",
    type: "choice",
    options: YES_NO,
  },
  Sex: {
    q: "What is your sex?",
    type: "choice",
    options: [
      [1, "Male"],
      [0, "Female"],
    ],
  },
  Age: {
    q: "Which age band are you in?",
    type: "select",
    options: [
      [1, "18 to 24"],
      [2, "25 to 29"],
      [3, "30 to 34"],
      [4, "35 to 39"],
      [5, "40 to 44"],
      [6, "45 to 49"],
      [7, "50 to 54"],
      [8, "55 to 59"],
      [9, "60 to 64"],
      [10, "65 to 69"],
      [11, "70 to 74"],
      [12, "75 to 79"],
      [13, "80 or older"],
    ],
  },
  Education: {
    q: "What is the highest level of education you finished?",
    type: "select",
    options: [
      [1, "Never attended school"],
      [2, "Elementary school"],
      [3, "Some high school"],
      [4, "High school graduate"],
      [5, "Some college"],
      [6, "College graduate"],
    ],
  },
  Income: {
    q: "Which band is your household income in?",
    type: "select",
    options: [
      [1, "Under $10,000"],
      [2, "$10,000 to $15,000"],
      [3, "$15,000 to $20,000"],
      [4, "$20,000 to $25,000"],
      [5, "$25,000 to $35,000"],
      [6, "$35,000 to $50,000"],
      [7, "$50,000 to $75,000"],
      [8, "$75,000 or more"],
    ],
  },
  AnyHealthcare: {
    q: "Do you have any healthcare coverage?",
    type: "choice",
    options: YES_NO,
  },
  NoDocbcCost: {
    q: "In the past year, did you need a doctor but could not afford one?",
    type: "choice",
    options: YES_NO,
  },
};

const STEPS = [
  {
    title: "Vitals",
    note: "The things a nurse would measure.",
    fields: ["HighBP", "HighChol", "CholCheck", "BMI"],
  },
  {
    title: "History",
    note: "Anything that has already happened.",
    fields: ["Smoker", "Stroke", "HeartDiseaseorAttack", "HvyAlcoholConsump"],
  },
  {
    title: "Daily life",
    note: "How the past month has actually been.",
    fields: ["PhysActivity", "GenHlth", "MentHlth", "PhysHlth", "DiffWalk"],
  },
  {
    title: "About you",
    note: "Background, and whether care is within reach.",
    fields: ["Sex", "Age", "Education", "Income", "AnyHealthcare", "NoDocbcCost"],
  },
];

const INITIAL = {
  HighBP: 0,
  HighChol: 0,
  CholCheck: 1,
  BMI: 25,
  Smoker: 0,
  Stroke: 0,
  HeartDiseaseorAttack: 0,
  PhysActivity: 1,
  HvyAlcoholConsump: 0,
  AnyHealthcare: 1,
  NoDocbcCost: 0,
  GenHlth: 3,
  MentHlth: 0,
  PhysHlth: 0,
  DiffWalk: 0,
  Sex: 0,
  Age: 1,
  Education: 4,
  Income: 5,
};

function PredictionForm() {
  const [formData, setFormData] = useState(INITIAL);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/predict`,
        formData
      );
      navigate("/results", {
        state: { result: response.data, answers: formData },
      });
    } catch (err) {
      setError(
        "Could not reach the screening service. Check that the API is running, then try again."
      );
      setBusy(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    submit();
  };

  const current = STEPS[step];

  return (
    <div className="container">
      <div className="form-shell">
        <div className="progress">
          <div className="progress-steps">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className={
                  "progress-bar" +
                  (i < step ? " done" : i === step ? " current" : "")
                }
              />
            ))}
          </div>
          <div className="progress-label">
            Step {step + 1} of {STEPS.length}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="step" key={step}>
            <h1 className="step-title">{current.title}</h1>
            <p className="step-note">{current.note}</p>

            {current.fields.map((name) => {
              const f = FIELDS[name];
              return (
                <div className="form-group" key={name}>
                  {f.type === "choice" ? (
                    <>
                      <span className="group-label" id={`${name}-label`}>
                        {f.q}
                      </span>
                      <div
                        className="radio-group"
                        role="radiogroup"
                        aria-labelledby={`${name}-label`}
                      >
                        {f.options.map(([value, text]) => (
                          <label key={value}>
                            <input
                              type="radio"
                              name={name}
                              value={value}
                              checked={formData[name] === value}
                              onChange={handleChange}
                            />
                            {text}
                          </label>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <label htmlFor={name}>{f.q}</label>
                      {f.type === "select" ? (
                        <select
                          id={name}
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                        >
                          {f.options.map(([value, text]) => (
                            <option key={value} value={value}>
                              {text}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="number"
                          id={name}
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          min={f.min}
                          max={f.max}
                          step={f.step}
                        />
                      )}
                    </>
                  )}

                  {f.bmiLink && (
                    <p className="field-hint">
                      Not sure?{" "}
                      <Link to="/bmi-calculator" className="bmi-link">
                        Work it out from your height and weight
                      </Link>
                    </p>
                  )}
                  {f.hint && <p className="field-hint">{f.hint}</p>}
                </div>
              );
            })}
          </div>

          <div className="form-actions">
            {step > 0 ? (
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setStep(step - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Back
              </button>
            ) : (
              <span />
            )}
            <button type="submit" disabled={busy}>
              {step < STEPS.length - 1
                ? "Continue"
                : busy
                ? "Checking..."
                : "See my result"}
            </button>
          </div>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default PredictionForm;
