import { useState } from "react";
import { Link } from "react-router-dom";
import DynamicChart from "../../components/DynamicChart/DynamicChart";
import "./Welcome.css";

function Welcome() {
  const [signup, setSignup] = useState(true);

  const handleRegistration = (e) => {
    e.preventDefault();
    // Handle registration logic here
  };

  const handleSignin = (e) => {
    e.preventDefault();
    // Handle sign-in logic here
  };

  return (
    <div className="welcome">
      <DynamicChart />
      <Link to="/test" className="welcome__logo">
        <img
          src="../src/assets/Logo.svg"
          alt="Logo"
          className="welcome__logo-img"
        />
        <span className="welcome__logo-text">Syntra</span>
      </Link>
      <div className="welcome__content">
        <div className="welcome__hero-text">
          <h1 className="welcome__title">
            Grow your portfolio with friends on Syntra
          </h1>
          <p className="welcome__subtitle">
            Collaborate on stocks in real time with Syntra. Share live charts,
            discuss trades via DMs, and make informed decisions together. Grow
            your portfolio faster by connecting with friends and trading
            smarter—side by side.
          </p>
        </div>
        <div className="welcome__form">
          <h2 className="welcome__form-title">Join the Market Collective</h2>
          {signup ? (
            <form
              onSubmit={handleRegistration}
              className="welcome__signup"
            ></form>
          ) : (
            <form onSubmit={handleSignin} className="welcome__signin"></form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Welcome;
