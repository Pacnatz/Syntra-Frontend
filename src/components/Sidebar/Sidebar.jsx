import { useState } from "react";

import TempImage from "../../assets/TempImage.svg";
import Message from "../../assets/Message.svg";
import Trash from "../../assets/Trash.svg";
import Gear from "../../assets/Gear.svg";
import WatchlistToggle from "../Toggle/WatchlistToggle";
import Logo from "../../assets/Logo.svg";
import "./Sidebar.css";

function Sidebar() {
  const [watchlistEnabled, setWatchlistEnabled] = useState(true);

  const handleToggle = () => {
    setWatchlistEnabled((prev) => !prev);
  };
  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <img
          src={Logo}
          alt="Logo"
          className="sidebar__logo-img"
          draggable={false}
        />
        <p className="sidebar__logo-text">Syntra</p>
      </div>
      <div className="sidebar__panel">
        <WatchlistToggle handleToggle={handleToggle} />
        {watchlistEnabled ? (
          <ul className="sidebar__list">
            <li className="sidebar__list-item">
              <p className="sidebar__list-item-text">AAPL</p>
              <p className="sidebar__list-item-text">$258.89</p>
            </li>
            <li className="sidebar__list-item">
              <p className="sidebar__list-item-text">GOOGL</p>
              <p className="sidebar__list-item-text">$314.75</p>
            </li>
            <li className="sidebar__list-item">
              <p className="sidebar__list-item-text">MSFT</p>
              <p className="sidebar__list-item-text">$373.55</p>
            </li>
          </ul>
        ) : (
          <ul className="sidebar__list">
            <li className="sidebar__list-item">
              <div className="sidebar__friend">
                <img
                  src={TempImage}
                  alt="Friend Image"
                  className="sidebar__friend-img"
                  draggable={false}
                />
                <p className="sidebar__list-item-text">Friend 1</p>
              </div>
              <div className="sidebar__list-icons">
                <button className="sidebar__list-icon-btn">
                  <img
                    src={Message}
                    alt="Message Friend"
                    className="sidebar__list-icon-img"
                    draggable={false}
                  />
                </button>
                <button className="sidebar__list-icon-btn">
                  <img
                    src={Trash}
                    alt="Remove Friend"
                    className="sidebar__list-icon-img"
                    draggable={false}
                  />
                </button>
              </div>
            </li>
            <li className="sidebar__list-item">
              <div className="sidebar__friend">
                <img
                  src={TempImage}
                  alt="Friend Image"
                  className="sidebar__friend-img"
                  draggable={false}
                />
                <p className="sidebar__list-item-text">Friend 2</p>
              </div>
              <div className="sidebar__list-icons">
                <button className="sidebar__list-icon-btn">
                  <img
                    src={Message}
                    alt="Message Friend"
                    className="sidebar__list-icon-img"
                    draggable={false}
                  />
                </button>
                <button className="sidebar__list-icon-btn">
                  <img
                    src={Trash}
                    alt="Remove Friend"
                    className="sidebar__list-icon-img"
                    draggable={false}
                  />
                </button>
              </div>
            </li>
            <li className="sidebar__list-item">
              <div className="sidebar__friend">
                <img
                  src={TempImage}
                  alt="Friend Image"
                  className="sidebar__friend-img"
                  draggable={false}
                />
                <p className="sidebar__list-item-text">Friend 3</p>
              </div>
              <div className="sidebar__list-icons">
                <button className="sidebar__list-icon-btn">
                  <img
                    src={Message}
                    alt="Message Friend"
                    className="sidebar__list-icon-img"
                    draggable={false}
                  />
                </button>
                <button className="sidebar__list-icon-btn">
                  <img
                    src={Trash}
                    alt="Remove Friend"
                    className="sidebar__list-icon-img"
                    draggable={false}
                  />
                </button>
              </div>
            </li>
          </ul>
        )}
      </div>
      <div className="sidebar__profile-icons">
        <div className="sidebar__profile">
          <img
            src={TempImage}
            alt="Profile"
            className="sidebar__profile-img"
            draggable={false}
          />
          <p className="sidebar__profile-name">John Doe</p>
        </div>
        <button className="sidebar__profile-btn">
          <img
            src={Gear}
            alt="Edit Profile Gear"
            className="sidebar__profile-gear"
            draggable={false}
          />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
