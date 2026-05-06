import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import SearchBar from "../SearchBar/SearchBar";
import Profile from "../../pages/Profile/Profile";
import SearchPage from "../../pages/SearchPage/SearchPage";
import StockPage from "../../pages/StockPage/StockPage";
import Menu from "../../assets/Menu.svg";
import { SocketProvider } from "../../context/SocketContext";
import { CurrentStockProvider } from "../../context/CurrentStockContext";
import "./Dashboard.css";

function Dashboard() {
  const [searchLoading, setSearchLoading] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <SocketProvider>
      <CurrentStockProvider>
        <div className="dashboard">
          <Sidebar
            watchlist={watchlist}
            setWatchlist={setWatchlist}
            sidebarOpen={sidebarOpen}
          />
          <div className="dashboard__content">
            <div className="dashboard__search">
              <SearchBar setSearchLoading={setSearchLoading} />
              <button
                onClick={handleSidebarToggle}
                className={`dashboard__menu-btn ${sidebarOpen ? "dashboard__menu-btn_open" : ""}`}
              >
                <img src={Menu} alt="Menu" className="dashboard__menu-icon" />
              </button>
            </div>
            <div
              className={`dashboard__panel ${sidebarOpen ? "dashboard__panel_close" : ""}`}
            >
              <Routes>
                {/* These are the panel routes*/}
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
                  element={
                    <StockPage
                      watchlist={watchlist}
                      setWatchlist={setWatchlist}
                    />
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </CurrentStockProvider>
    </SocketProvider>
  );
}

export default Dashboard;
