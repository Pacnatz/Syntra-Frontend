import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "../../hooks/useForm";
import DynamicChart from "../../components/DynamicChart/DynamicChart";
import LoginToggle from "../../components/LoginToggle/LoginToggle";
import Logo from "../../assets/Logo.svg";
import RightArrow from "../../assets/RightArrow.svg";
import "./Welcome.css";

function Welcome() {
  const navigate = useNavigate();
  const [signup, setSignup] = useState(true);
  const [rotationIndex, setRotationIndex] = useState(0);

  const signupDefaultValues = {
    username: { value: "", valid: false, validityMessage: "" },
    email: { value: "", valid: false, validityMessage: "" },
    password: { value: "", valid: false, validityMessage: "" },
    confirmPassword: { value: "", valid: false, validityMessage: "" },
  };

  const signinDefaultValues = {
    username: { value: "", valid: false, validityMessage: "" },
    password: { value: "", valid: false, validityMessage: "" },
    rememberme: { value: false, valid: false, validityMessage: "" },
  };

  const {
    values: signupValues,
    handleChange: handleSignupChange,
    setValues: setSignupValues,
  } = useForm(signupDefaultValues);

  const {
    values: signinValues,
    handleChange: handleSigninChange,
    setValues: setSigninValues,
  } = useForm(signinDefaultValues);

  const signupFormValid =
    signupValues.username.valid &&
    signupValues.email.valid &&
    signupValues.password.valid &&
    signupValues.confirmPassword.valid;

  const passwordsMatch =
    signupValues.password.value === signupValues.confirmPassword.value;

  const handleToggle = () => {
    setSignup((prevSignup) => !prevSignup);
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    // Handle registration logic here
    setSignupValues(signupDefaultValues); // Reset form after submission
    navigate("/dashboard");
  };

  const handleSignin = (e) => {
    e.preventDefault();
    // Handle sign-in logic here
    setSigninValues(signinDefaultValues); // Reset form after submission
    navigate("/dashboard");
  };

  useEffect(() => {
    // Initial render
    const textRotationInterval = setInterval(() => {
      setRotationIndex((prevIndex) => {
        return prevIndex === 2 ? 0 : prevIndex + 1;
      });
    }, 3000); // Rotate text every 3 seconds

    // Check the router's current path on initial load
    if (window.location.pathname !== "/") {
      navigate("/");
    }

    return () => clearInterval(textRotationInterval);
  }, [navigate]);

  return (
    <div className="welcome">
      <DynamicChart />
      <Link to="/" className="welcome__logo">
        <img src={Logo} alt="Logo" className="welcome__logo-img" />
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
          <LoginToggle handleToggle={handleToggle} />
          {signup ? (
            <form onSubmit={handleRegistration} className="welcome__form">
              <div className="welcome__inputs">
                <label htmlFor="username" className="welcome__form-label">
                  Username
                  <input
                    name="username"
                    id="username"
                    type="text"
                    placeholder="Username"
                    className="welcome__form-input"
                    minLength={2}
                    maxLength={20}
                    value={signupValues.username.value}
                    onChange={handleSignupChange}
                    required
                  />
                </label>
                <p className="welcome__input-error">
                  {signupValues.username.valid
                    ? ""
                    : signupValues.username.validityMessage}
                </p>
                <label htmlFor="email" className="welcome__form-label">
                  Email
                  <input
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Email"
                    className="welcome__form-input"
                    value={signupValues.email.value}
                    onChange={handleSignupChange}
                    required
                  />
                </label>
                <p className="welcome__input-error">
                  {signupValues.email.valid
                    ? ""
                    : signupValues.email.validityMessage}
                </p>
                <label htmlFor="password" className="welcome__form-label">
                  Password
                  <input
                    name="password"
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="welcome__form-input"
                    minLength={3}
                    value={signupValues.password.value}
                    onChange={handleSignupChange}
                    required
                  />
                </label>
                <p className="welcome__input-error">
                  {signupValues.password.valid
                    ? ""
                    : signupValues.password.validityMessage}
                </p>
                <label
                  htmlFor="confirmPassword"
                  className="welcome__form-label"
                >
                  Confirm Password
                  <input
                    name="confirmPassword"
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className="welcome__form-input"
                    value={signupValues.confirmPassword.value}
                    onChange={handleSignupChange}
                    required
                  />
                </label>
                <p className="welcome__input-error">
                  {!passwordsMatch &&
                  signupValues.confirmPassword.value.length > 2
                    ? "Passwords do not match"
                    : ""}
                </p>
              </div>
              <button
                type="submit"
                disabled={!(signupFormValid && passwordsMatch)}
                className="welcome__signup-btn"
              >
                <p className="welcome__signup-btn-text">
                  Get Started
                  <img
                    src={RightArrow}
                    alt="Get Started Arrow"
                    className="welcome__signup-arrow"
                  />
                </p>
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignin} className="welcome__form">
              <div className="welcome__inputs">
                <label htmlFor="username" className="welcome__form-label">
                  Username
                  <input
                    name="username"
                    id="username"
                    type="text"
                    placeholder="Username"
                    className="welcome__form-input"
                    value={signinValues.username.value}
                    onChange={handleSigninChange}
                  />
                </label>
                <p className="welcome__input-error"></p>
                <label htmlFor="password" className="welcome__form-label">
                  Password
                  <input
                    name="password"
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="welcome__form-input"
                    value={signinValues.password.value}
                    onChange={handleSigninChange}
                  />
                </label>
                <p className="welcome__input-error">
                  {/* Place login error message here */}
                </p>
                <label htmlFor="rememberme" className="welcome__checkbox-label">
                  <input
                    name="rememberme"
                    id="rememberme"
                    type="checkbox"
                    className="welcome__checkbox-input"
                    checked={signinValues.rememberme.value}
                    onChange={handleSigninChange}
                  />
                  <span className="welcome__checkbox-box"></span>
                  <span className="welcome__checkbox-checkmark"></span>
                  <span className="welcome__checkbox-text">Remember me</span>
                </label>
              </div>
              <button type="submit" className="welcome__signup-btn">
                <p className="welcome__signup-btn-text">
                  Continue
                  <img
                    src={RightArrow}
                    alt="Continue Arrow"
                    className="welcome__signup-arrow"
                  />
                </p>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Welcome;
