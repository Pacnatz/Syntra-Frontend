import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import SearchBar from "../../components/SearchBar/SearchBar";
import Profile from "../Profile/Profile";
import SearchPage from "../SearchPage/SearchPage";
import StockPage from "../StockPage/StockPage";
import SearchContext from "../../context/SearchContext";
import "./Dashboard.css";

function Dashboard() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  return (
    <SearchContext.Provider
      value={{ searchResult, setSearchResult, searchLoading, setSearchLoading }}
    >
      <div className="dashboard">
        <Sidebar />
        <div className="dashboard__content">
          <SearchBar />
          <div className="dashboard__panel">
            <Routes>
              {/* This is a placeholder route.*/}
              <Route path="/" element={<Profile />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path={"/stock/:symbol"} element={<StockPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </SearchContext.Provider>
  );
}

export default Dashboard;
