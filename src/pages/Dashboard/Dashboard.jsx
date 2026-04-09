import { Routes, Route } from "react-router-dom";

import Profile from "../Profile/Profile";
import SearchBar from "../../components/SearchBar/SearchBar";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard__content">
        <SearchBar />
        <div className="dashboard__panel">
          <Routes>
            {/* This is a placeholder route.*/}
            <Route path="/" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
