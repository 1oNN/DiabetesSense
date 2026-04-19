import copyrightLogo from "../assets/copyright.png";

export default function Footer() {
  return (
    <footer>
      <p>
        <img src={copyrightLogo} alt="Copyright Logo" className="footer-logo" />{" "}
        All rights reserved

      </p>
    </footer>
  );
}
