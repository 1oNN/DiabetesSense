import React, { useState } from "react";
import { Link } from "react-router-dom";
import hamburgerMenu from "../assets/hamburger-menu.png";

/* The mark is the same gauge idea the result page uses: a scale with a
   reading on it. Drawn inline so it takes the ink colour. */
const Mark = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
    <circle cx="13" cy="13" r="10" fill="none" stroke="#dde5e3" strokeWidth="2.5" />
    <path
      d="M13 3a10 10 0 0 1 8.66 5"
      fill="none"
      stroke="#0e6f63"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="13" cy="13" r="2.1" fill="#12312e" />
  </svg>
);

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const close = () => setNavOpen(false);

  return (
    <header>
      <div className="logo-nav-container">
        <div className="logo-container">
          <Link to="/" onClick={close}>
            <Mark />
            <span className="wordmark">DiabetesSense</span>
          </Link>
        </div>
        <button
          className="hamburger"
          onClick={() => setNavOpen(!navOpen)}
          aria-expanded={navOpen}
          aria-label="Menu"
        >
          <img src={hamburgerMenu} alt="" />
        </button>
      </div>
      <nav className={navOpen ? "nav-open" : ""}>
        <Link to="/" onClick={close}>
          Home
        </Link>
        <Link to="/predict" onClick={close}>
          Screen
        </Link>
        <Link to="/bmi-calculator" onClick={close}>
          BMI
        </Link>
        <Link to="/about" onClick={close}>
          About
        </Link>
        <Link to="/contact" onClick={close}>
          Contact
        </Link>
      </nav>
    </header>
  );
};

export default Header;
