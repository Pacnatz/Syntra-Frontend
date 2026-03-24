import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DynamicChart from "../../components/DynamicChart/DynamicChart";
import LoginToggle from "../../components/LoginToggle/LoginToggle";
import "./Welcome.css";

function Welcome() {
  const [signup, setSignup] = useState(true);
  const [rotationIndex, setRotationIndex] = useState(0);

  const handleRegistration = (e) => {
    e.preventDefault();
    // Handle registration logic here
  };

  const handleSignin = (e) => {
    e.preventDefault();
    // Handle sign-in logic here
  };

  useEffect(() => {
    const textRotationInterval = setInterval(() => {
      setRotationIndex((prevIndex) => {
        return prevIndex === 2 ? 0 : prevIndex + 1;
      });
    }, 3000); // Rotate text every 3 seconds
    return () => clearInterval(textRotationInterval);
  }, []);

  return (
    <div className="welcome">
      <DynamicChart />
      <Link to="/test" className="welcome__logo">
        <img
          src="../src/assets/Logo.svg"
          alt="Logo"
          className="welcome__logo-img"
        />
        <p className="welcome__logo-text">Syntra</p>
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
          <ul className="welcome__rotating-text">
            <li
              className={
                "welcome__rotating-text-item" +
                (rotationIndex === 0
                  ? " welcome__rotating-text-item_active"
                  : "") +
                (rotationIndex === 1
                  ? " welcome__rotating-text-item_close"
                  : "")
              }
            >
              No more screenshots.
            </li>
            <li
              className={
                "welcome__rotating-text-item" +
                (rotationIndex === 1
                  ? " welcome__rotating-text-item_active"
                  : "") +
                (rotationIndex === 2
                  ? " welcome__rotating-text-item_close"
                  : "")
              }
            >
              No more switching tabs.
            </li>
            <li
              className={
                "welcome__rotating-text-item" +
                (rotationIndex === 2
                  ? " welcome__rotating-text-item_active"
                  : "") +
                (rotationIndex === 0
                  ? " welcome__rotating-text-item_close"
                  : "")
              }
            >
              Everything happens in one place.
            </li>
          </ul>
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
                <p className="welcome__signup-btn-text">Get Started</p>
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
