import { Routes, Route } from "react-router-dom";

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
            <Route
              path="test"
              element={
                <div>
                  <h1>Dashboard</h1>
                  <p>
                    Welcome to your dashboard! Here you can manage your
                    portfolio and connect with friends.
                  </p>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
