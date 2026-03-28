import "./LoginToggle.css";

function LoginToggle({ handleToggle }) {
  return (
    <label htmlFor="login-toggle" className="login-toggle">
      <input
        type="checkbox"
        id="login-toggle"
        className="login-toggle__checkbox"
        onChange={handleToggle}
      />
      <span className="login-toggle__signup-text">Sign Up</span>
      <span className="login-toggle__login-text">Log In</span>
      <span className="login-toggle__slider"></span>
    </label>
  );
}

export default LoginToggle;
