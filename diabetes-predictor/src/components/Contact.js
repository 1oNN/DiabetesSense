import React from "react";
import "../App.css";

function Contact() {
  return (
    <div className="container">
      <h1>Contact</h1>
      <p className="hero-lede">
        Questions about the model, the data, or something that looks wrong.
      </p>

      <dl className="hero-facts">
        <div className="hero-fact">
          <dt>Email</dt>
          <dd style={{ fontSize: "0.95rem" }}>
            <a href="mailto:hammadahmad9999@hotmail.com">
              hammadahmad9999@hotmail.com
            </a>
          </dd>
        </div>
      </dl>

      <p style={{ marginTop: "2rem" }}>
        COMSATS University Islamabad
        <br />
        Park Road, Tarlai Kalan
        <br />
        Islamabad, Pakistan
      </p>
    </div>
  );
}

export default Contact;
