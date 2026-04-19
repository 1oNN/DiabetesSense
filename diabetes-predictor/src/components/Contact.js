import React from "react";
import "../App.css";

function Contact({ darkMode }) {
  return (
    <div className="container">
      <h1>Contact Us</h1>
      <p>
        If you have any questions, feedback, or concerns, please feel free to
        reach out to us.
      </p>
      <p>
        Email:{" "}
        <a
          href="mailto:support@diabetespredictorapp.com"
          style={{ color: "#ff6f61" }}
        >
          hammadahmad9999@hotmail.com{" "}
        </a>
      </p>
      <p>
        Address: Comsats University Islamabad, Park Road, Tarlai Kalan,
        Islamabad, Pakistan
      </p>
    </div>
  );
}

export default Contact;
