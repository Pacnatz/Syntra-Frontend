import { useRef, useState } from "react";

import TempImage from "../../assets/TempImage.svg";
import EditIcon from "../../assets/EditIcon.svg";
import "./Profile.css";

function Profile() {
  const [profileImage, setProfileImage] = useState(TempImage);
  const fileInputRef = useRef(null);

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
    </div>
  );
}

export default Profile;
