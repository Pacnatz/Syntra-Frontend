import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import SearchBar from "../../components/SearchBar/SearchBar";
import Profile from "../Profile/Profile";
import SearchPage from "../SearchPage/SearchPage";
import StockPage from "../StockPage/StockPage";
import { SocketProvider } from "../../context/SocketContext";
import { CurrentStockProvider } from "../../context/CurrentStockContext";
import "./Dashboard.css";

function Dashboard() {
  const [searchLoading, setSearchLoading] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  return (
    <SocketProvider>
      <CurrentStockProvider>
        <div className="dashboard">
          <Sidebar watchlist={watchlist} setWatchlist={setWatchlist} />
          <div className="dashboard__content">
            <SearchBar setSearchLoading={setSearchLoading} />
            <div className="dashboard__panel">
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
