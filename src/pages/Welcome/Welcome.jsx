import { useState } from "react";
import { Link } from "react-router-dom";
import DynamicChart from "../../components/DynamicChart/DynamicChart";
import LoginToggle from "../../components/LoginToggle/LoginToggle";
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
        <div className="welcome__panel">
          <h2 className="welcome__panel-title">Join the Market Collective</h2>
          <LoginToggle />
          {signup ? (
            <form onSubmit={handleRegistration} className="welcome__signup">
              <label htmlFor="username" className="welcome__signup-label">
                Username
                <input
                  name="username"
                  id="username"
                  type="text"
                  placeholder="Username"
                  className="welcome__signup-input"
                />
              </label>
              <label htmlFor="email" className="welcome__signup-label">
                Email
                <input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="welcome__signup-input"
                />
              </label>
              <label htmlFor="password" className="welcome__signup-label">
                Password
                <input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="welcome__signup-input"
                />
              </label>
              <label
                htmlFor="confirm-password"
                className="welcome__signup-label"
              >
                Confirm Password
                <input
                  name="confirm-password"
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm Password"
                  className="welcome__signup-input"
                />
              </label>
              <button className="welcome__signup-btn">
                Get Started
                <img
                  src="src\assets\RightArrow.svg"
                  alt=""
                  className="welcome__signup-arrow"
                />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignin} className="welcome__signin"></form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Welcome;
