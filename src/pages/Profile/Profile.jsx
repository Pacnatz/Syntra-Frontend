import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useForm } from "../../hooks/useForm";
import TempImage from "../../assets/TempImage.svg";
import EditIcon from "../../assets/EditIcon.svg";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(TempImage);
  const fileInputRef = useRef(null);

  const passwordDefaultValues = {
    password: { value: "", valid: false, validityMessage: "" },
    confirmPassword: { value: "", valid: false, validityMessage: "" },
  };
  const {
    values: passwordValues,
    handleChange: handlePasswordChange,
    handleBlur: handlePasswordBlur,
  } = useForm(passwordDefaultValues);

  const passwordsMatch =
    passwordValues.password.value === passwordValues.confirmPassword.value;

  const formValid =
    passwordValues.password.valid && passwordValues.confirmPassword.valid;

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  // Temporary image upload. Need to implement backend storage and retrieval for persistent profile images.
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSignOut = () => {
    // TODO: Implement sign out logic
    navigate("/");
  };

  return (
    <div className="profile">
      <div className="profile__header">
        <img
          src={profileImage}
          alt="Profile Image"
          className="profile__img"
          draggable={false}
        />
        <div className="profile__avatar">
          <h2 className="profile__name">John Doe</h2>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
          <button
            type="button"
            className="profile__edit-btn"
            onClick={handleEditClick}
          >
            <img
              src={EditIcon}
              alt="Edit Icon"
              className="profile__edit-btn-img"
              draggable={false}
            />
            <span className="profile__edit-btn-text">Edit Profile</span>
          </button>
        </div>
      </div>
      <div className="profile__details">
        <h3 className="profile__section-title">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="profile__form">
          <label htmlFor="password" className="profile__form-label">
            Password
            <input
              name="password"
              id="password"
              type="password"
              placeholder="Password"
              className="profile__form-input"
              minLength={3}
              value={passwordValues.password.value}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              required
            />
          </label>
          <p className="profile__input-error">
            {passwordValues.password.valid
              ? ""
              : passwordValues.password.validityMessage}
          </p>
          <label htmlFor="confirmPassword" className="profile__form-label">
            Confirm Password
            <input
              name="confirmPassword"
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="profile__form-input"
              value={passwordValues.confirmPassword.value}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              required
            />
          </label>
          <p className="profile__input-error">
            {!passwordsMatch && passwordValues.confirmPassword.value.length > 2
              ? "Passwords do not match"
              : ""}
          </p>
          <button
            type="submit"
            disabled={!(formValid && passwordsMatch)}
            className="profile__form-btn"
          >
            <p type="submit" className="profile__form-btn-text">
              Save Changes
            </p>
          </button>
        </form>
      </div>
      <button onClick={handleSignOut} className="profile__signout-btn">
        Sign Out
      </button>
    </div>
  );
}

export default Profile;
