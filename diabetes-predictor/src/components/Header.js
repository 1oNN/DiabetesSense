import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import hamburgerMenu from "../assets/hamburger-menu.png";

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  return (
    <header>
      <div className="logo-nav-container">
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="hamburger" onClick={toggleNav}>
          <img src={hamburgerMenu} alt="Hamburger Menu" />
        </div>
      </div>
      <nav className={navOpen ? "nav-open" : ""}>
        <Link to="/" onClick={toggleNav}>
          Home
        </Link>
        <Link to="/predict" onClick={toggleNav}>
          Predict
        </Link>
        <Link to="/bmi-calculator" onClick={toggleNav}>
          BMI Calculator
        </Link>
        <Link to="/about" onClick={toggleNav}>
          About
        </Link>
        <Link to="/contact" onClick={toggleNav}>
          Contact
        </Link>
      </nav>
    </header>
  );
};

export default Header;
