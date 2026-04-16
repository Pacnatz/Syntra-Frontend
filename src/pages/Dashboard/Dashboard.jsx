import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import SearchBar from "../../components/SearchBar/SearchBar";
import Profile from "../Profile/Profile";
import SearchPage from "../SearchPage/SearchPage";
import StockPage from "../StockPage/StockPage";
import { SocketProvider } from "../../context/SocketContext";
import "./Dashboard.css";

function Dashboard() {
  const [searchLoading, setSearchLoading] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  return (
    <SocketProvider>
      <div className="dashboard">
        <Sidebar watchlist={watchlist} />
        <div className="dashboard__content">
          <SearchBar setSearchLoading={setSearchLoading} />
          <div className="dashboard__panel">
            <Routes>
              {/* This is a placeholder route.*/}
              <Route path="/" element={<Profile />} />
              <Route
                path="/search"
                element={
                  <SearchPage
                    searchLoading={searchLoading}
                    setSearchLoading={setSearchLoading}
                  />
                }
              />
              <Route
                path={"/stock/:symbol"}
                element={<StockPage setWatchlist={setWatchlist} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </SocketProvider>
  );
}

export default Dashboard;
